using BIDashboard.Models;

namespace BIDashboard.Services;

public class StatisticsService
{
    private readonly ColumnAnalyzerService _analyzer;

    public StatisticsService(ColumnAnalyzerService analyzer) => _analyzer = analyzer;

    public List<StatSummary> Compute(
        List<string> headers,
        List<ColumnInfo> columns,
        List<Dictionary<string, string>> rows)
    {
        var stats = new List<StatSummary>();

        foreach (var col in columns)
        {
            var values = rows.Select(r => r.TryGetValue(col.Name, out var v) ? v : "").ToList();

            if (col.Type == ColumnType.Number)
            {
                var nums = values.Select(v => _analyzer.ParseNumber(v))
                                 .Where(n => n.HasValue)
                                 .Select(n => n!.Value)
                                 .ToList();
                if (nums.Count == 0) continue;
                stats.Add(new StatSummary(
                    col.Name,
                    Math.Round(nums.Min(), 2),
                    Math.Round(nums.Max(), 2),
                    Math.Round(nums.Average(), 2),
                    Math.Round(nums.Sum(), 2),
                    null, null
                ));
            }
            else if (col.Type == ColumnType.Category)
            {
                var top = values
                    .Where(v => !string.IsNullOrWhiteSpace(v))
                    .GroupBy(v => v, StringComparer.OrdinalIgnoreCase)
                    .OrderByDescending(g => g.Count())
                    .FirstOrDefault();

                stats.Add(new StatSummary(
                    col.Name,
                    null, null, null, null,
                    top?.Key,
                    top?.Count()
                ));
            }
        }
        return stats;
    }
}
