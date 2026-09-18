using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using ClosedXML.Excel;

namespace BIDashboard.Services;

public class FileParserService
{
    public (List<string> Headers, List<Dictionary<string, string>> Rows) Parse(IFormFile file)
    {
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        return ext switch
        {
            ".csv" => ParseCsv(file),
            ".xlsx" or ".xls" => ParseExcel(file),
            _ => throw new NotSupportedException($"Unsupported file type: {ext}")
        };
    }

    private static (List<string>, List<Dictionary<string, string>>) ParseCsv(IFormFile file)
    {
        using var reader = new StreamReader(file.OpenReadStream());
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            MissingFieldFound = null,
            BadDataFound = null,
            TrimOptions = TrimOptions.Trim,
        };
        using var csv = new CsvReader(reader, config);

        csv.Read();
        csv.ReadHeader();
        var headers = csv.HeaderRecord?.ToList() ?? [];

        var rows = new List<Dictionary<string, string>>();
        while (csv.Read())
        {
            var row = new Dictionary<string, string>();
            foreach (var h in headers)
                row[h] = csv.GetField(h) ?? "";
            rows.Add(row);
        }
        return (headers, rows);
    }

    private static (List<string>, List<Dictionary<string, string>>) ParseExcel(IFormFile file)
    {
        using var wb = new XLWorkbook(file.OpenReadStream());
        var ws = wb.Worksheets.First();
        var usedRange = ws.RangeUsed();
        if (usedRange is null) return ([], []);

        var firstRow = usedRange.FirstRow();
        var headers = firstRow.Cells().Select(c => c.GetString().Trim()).ToList();

        var rows = new List<Dictionary<string, string>>();
        foreach (var row in usedRange.RowsUsed().Skip(1))
        {
            var dict = new Dictionary<string, string>();
            var cells = row.Cells().ToList();
            for (int i = 0; i < headers.Count; i++)
                dict[headers[i]] = i < cells.Count ? cells[i].GetString().Trim() : "";
            rows.Add(dict);
        }
        return (headers, rows);
    }
}
