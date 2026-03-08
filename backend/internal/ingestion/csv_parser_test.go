package ingestion_test

import (
	"io"
	"strings"
	"testing"

	"github.com/contextcloud/backend/internal/ingestion"
)

func TestNewCSVParser_ValidCSV(t *testing.T) {
	csv := "name,type,email\nAcme Corp,customer,acme@test.com\nGlobal Inc,supplier,global@test.com"
	parser, err := ingestion.NewCSVParser(strings.NewReader(csv))
	if err != nil {
		t.Fatalf("NewCSVParser: %v", err)
	}

	header := parser.Header()
	if len(header) != 3 {
		t.Fatalf("Header length = %d, want 3", len(header))
	}
	if header[0] != "name" || header[1] != "type" || header[2] != "email" {
		t.Errorf("Header = %v, want [name, type, email]", header)
	}
}

func TestNewCSVParser_EmptyFile(t *testing.T) {
	_, err := ingestion.NewCSVParser(strings.NewReader(""))
	if err == nil {
		t.Error("Expected error for empty CSV")
	}
}

func TestCSVParser_ReadBatch_AllRows(t *testing.T) {
	csv := "name,type\nAlice,customer\nBob,supplier\nCharlie,product"
	parser, _ := ingestion.NewCSVParser(strings.NewReader(csv))

	batch, err := parser.ReadBatch(10)
	if err != nil {
		t.Fatalf("ReadBatch: %v", err)
	}

	if len(batch) != 3 {
		t.Fatalf("Batch length = %d, want 3", len(batch))
	}

	if batch[0]["name"] != "Alice" {
		t.Errorf("Row 0 name = %q, want %q", batch[0]["name"], "Alice")
	}
	if batch[1]["type"] != "supplier" {
		t.Errorf("Row 1 type = %q, want %q", batch[1]["type"], "supplier")
	}
	if batch[2]["name"] != "Charlie" {
		t.Errorf("Row 2 name = %q, want %q", batch[2]["name"], "Charlie")
	}
}

func TestCSVParser_ReadBatch_Chunked(t *testing.T) {
	csv := "id,name\n1,A\n2,B\n3,C\n4,D\n5,E"
	parser, _ := ingestion.NewCSVParser(strings.NewReader(csv))

	// Read first 2
	batch1, err := parser.ReadBatch(2)
	if err != nil {
		t.Fatalf("Batch 1: %v", err)
	}
	if len(batch1) != 2 {
		t.Fatalf("Batch 1 length = %d, want 2", len(batch1))
	}
	if batch1[0]["id"] != "1" || batch1[1]["id"] != "2" {
		t.Errorf("Batch 1 ids wrong: %v", batch1)
	}

	// Read next 2
	batch2, err := parser.ReadBatch(2)
	if err != nil {
		t.Fatalf("Batch 2: %v", err)
	}
	if len(batch2) != 2 {
		t.Fatalf("Batch 2 length = %d, want 2", len(batch2))
	}
	if batch2[0]["id"] != "3" || batch2[1]["id"] != "4" {
		t.Errorf("Batch 2 ids wrong: %v", batch2)
	}

	// Read remaining (1 row)
	batch3, err := parser.ReadBatch(2)
	if err != nil {
		t.Fatalf("Batch 3: %v", err)
	}
	if len(batch3) != 1 {
		t.Fatalf("Batch 3 length = %d, want 1", len(batch3))
	}

	// Should get EOF
	_, err = parser.ReadBatch(2)
	if err != io.EOF {
		t.Errorf("Expected io.EOF after all rows, got %v", err)
	}
}

func TestCSVParser_ReadBatch_LazyQuotes(t *testing.T) {
	csv := `name,description
"Acme Corp","A ""big"" company"
Normal,Simple`
	parser, _ := ingestion.NewCSVParser(strings.NewReader(csv))

	batch, err := parser.ReadBatch(10)
	if err != nil {
		t.Fatalf("ReadBatch: %v", err)
	}

	if len(batch) != 2 {
		t.Fatalf("Batch length = %d, want 2", len(batch))
	}
	if batch[0]["description"] != `A "big" company` {
		t.Errorf("Quoted field = %q", batch[0]["description"])
	}
}

func TestCSVParser_ReadBatch_TrimWhitespace(t *testing.T) {
	csv := "name, type\n  Alice , customer "
	parser, _ := ingestion.NewCSVParser(strings.NewReader(csv))

	batch, _ := parser.ReadBatch(10)
	if len(batch) != 1 {
		t.Fatalf("Batch length = %d, want 1", len(batch))
	}

	// TrimLeadingSpace is enabled, so leading spaces are trimmed on values
	if batch[0]["name"] != "Alice " {
		t.Errorf("name = %q (leading space should be trimmed)", batch[0]["name"])
	}
}
