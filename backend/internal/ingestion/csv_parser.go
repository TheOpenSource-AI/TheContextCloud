package ingestion

import (
	"encoding/csv"
	"fmt"
	"io"
)

// CSVParser provides streaming CSV parsing for large files.
type CSVParser struct {
	reader *csv.Reader
	header []string
}

// NewCSVParser creates a streaming parser from any io.Reader.
func NewCSVParser(r io.Reader) (*CSVParser, error) {
	reader := csv.NewReader(r)
	reader.LazyQuotes = true
	reader.TrimLeadingSpace = true

	// Read header row
	header, err := reader.Read()
	if err != nil {
		return nil, fmt.Errorf("read csv header: %w", err)
	}

	return &CSVParser{reader: reader, header: header}, nil
}

// Header returns the column names.
func (p *CSVParser) Header() []string {
	return p.header
}

// ReadBatch reads up to `batchSize` rows and returns them as maps.
// Returns io.EOF when the file is fully consumed.
func (p *CSVParser) ReadBatch(batchSize int) ([]map[string]string, error) {
	var batch []map[string]string

	for i := 0; i < batchSize; i++ {
		record, err := p.reader.Read()
		if err == io.EOF {
			if len(batch) > 0 {
				return batch, nil // Return partial batch + signal done next call
			}
			return nil, io.EOF
		}
		if err != nil {
			return nil, fmt.Errorf("read csv row: %w", err)
		}

		row := make(map[string]string, len(p.header))
		for j, col := range p.header {
			if j < len(record) {
				row[col] = record[j]
			}
		}
		batch = append(batch, row)
	}

	return batch, nil
}
