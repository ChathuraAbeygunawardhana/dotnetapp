using System.Globalization;
using BIDashboard.Models;

namespace BIDashboard.Services;

public class ColumnAnalyzerService
{
    private static readonly string[] DateFormats =
    [
        "yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy/MM/dd",
        "MM-dd-yyyy", "dd-MM-yyyy", "MMM yyyy", "MMMM yyyy",
        "yyyy-MM", "MM/yyyy", "dd MMM yyyy", "d MMM yyyy",
        "yyyy-MM-ddTHH:mm:ss", "MM/dd/yyyy HH:mm:ss"
    ];

    public ColumnType Detect(IEnumerable<string> values)
    {
        var samples = values.Where(v => !string.IsNullOrWhiteSpace(v)).Take(50).ToList();
        if (samples.Count == 0) return ColumnType.Unknown;

        int dateHits = samples.Count(IsDate);
        if (dateHits >= samples.Count * 0.8) return ColumnType.Date;

        int numHits = samples.Count(IsNumber);
        if (numHits >= samples.Count * 0.8) return ColumnType.Number;

        int distinctCount = samples.Distinct(StringComparer.OrdinalIgnoreCase).Count();
        if (distinctCount <= Math.Max(2, samples.Count * 0.4))
            return ColumnType.Category;

        return ColumnType.Unknown;
    }

    private static bool IsDate(string v) =>
        DateTime.TryParseExact(v, DateFormats, CultureInfo.InvariantCulture,
            DateTimeStyles.None, out _) ||
        DateTime.TryParse(v, out _);

    private static bool IsNumber(string v) =>
        double.TryParse(v.Replace(",", ""), NumberStyles.Any,
            CultureInfo.InvariantCulture, out _);

    public DateTime? ParseDate(string v)
    {
        if (DateTime.TryParseExact(v, DateFormats, CultureInfo.InvariantCulture,
                DateTimeStyles.None, out var d1)) return d1;
        if (DateTime.TryParse(v, out var d2)) return d2;
        return null;
    }

    public double? ParseNumber(string v) =>
        double.TryParse(v.Replace(",", ""), NumberStyles.Any,
            CultureInfo.InvariantCulture, out var d) ? d : null;
}
