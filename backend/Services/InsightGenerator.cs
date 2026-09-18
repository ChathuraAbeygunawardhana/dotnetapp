using BIDashboard.Models;

namespace BIDashboard.Services;

public class InsightGenerator
{
    public List<string> Generate(
        int rowCount,
        List<ColumnInfo> columns,
        List<StatSummary> stats,
        List<Dictionary<string, string>> rows)
    {
        var insights = new List<string>();
        var numStats = stats.Where(s => s.Min.HasValue).ToList();
        var catStats = stats.Where(s => s.TopCategory != null).ToList();
        var dateCol = columns.FirstOrDefault(c => c.Type == ColumnType.Date);

        // Row count
        insights.Add($"The dataset contains {rowCount:N0} rows and {columns.Count} columns.");

        // Highest / lowest for each numeric column (top 2)
        foreach (var s in numStats.Take(2))
        {
            insights.Add($"{s.Column} ranges from {s.Min:N2} to {s.Max:N2}, with an average of {s.Mean:N2}.");
        }

        // Sum insight
        foreach (var s in numStats.Where(s => s.Sum.HasValue).Take(1))
        {
            insights.Add($"Total {s.Column} across all records is {s.Sum:N2}.");
        }

        // Top category
        foreach (var s in catStats.Take(2))
        {
            var pct = rowCount > 0 ? (double)s.TopCategoryCount!.Value / rowCount * 100 : 0;
            insights.Add($"The most common {s.Column} is \"{s.TopCategory}\" ({s.TopCategoryCount} records, {pct:F0}%).");
        }

        // Trend insight (first vs last period)
        if (dateCol != null && numStats.Count > 0)
        {
            var numCol = numStats[0].Column;
            var ordered = rows
                .Where(r => !string.IsNullOrWhiteSpace(r.GetValueOrDefault(dateCol.Name))
                         && double.TryParse(r.GetValueOrDefault(numCol, "").Replace(",", ""), out _))
                .OrderBy(r => r[dateCol.Name])
                .ToList();

            if (ordered.Count >= 4)
            {
                var firstHalf = ordered.Take(ordered.Count / 2)
                    .Average(r => double.TryParse(r[numCol].Replace(",", ""), out var n) ? n : 0);
                var secondHalf = ordered.Skip(ordered.Count / 2)
                    .Average(r => double.TryParse(r[numCol].Replace(",", ""), out var n) ? n : 0);
                var direction = secondHalf > firstHalf ? "increased" : "decreased";
                var changePct = firstHalf != 0
                    ? Math.Abs((secondHalf - firstHalf) / firstHalf * 100) : 0;
                insights.Add($"{numCol} {direction} by {changePct:F1}% from the first half to the second half of the dataset.");
            }
        }

        // Distinct categories count
        foreach (var col in columns.Where(c => c.Type == ColumnType.Category).Take(1))
        {
            var distinct = rows.Select(r => r.GetValueOrDefault(col.Name, ""))
                               .Where(v => !string.IsNullOrWhiteSpace(v))
                               .Distinct(StringComparer.OrdinalIgnoreCase)
                               .Count();
            insights.Add($"There are {distinct} distinct values in the {col.Name} column.");
        }

        return insights.Take(6).ToList();
    }
}
