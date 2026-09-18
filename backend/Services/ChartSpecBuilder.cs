using BIDashboard.Models;

namespace BIDashboard.Services;

public class ChartSpecBuilder
{
    private readonly ColumnAnalyzerService _analyzer;

    public ChartSpecBuilder(ColumnAnalyzerService analyzer) => _analyzer = analyzer;

    public List<ChartSpec> Build(
        List<ColumnInfo> columns,
        List<Dictionary<string, string>> rows)
    {
        var charts = new List<ChartSpec>();
        var dates = columns.Where(c => c.Type == ColumnType.Date).ToList();
        var numbers = columns.Where(c => c.Type == ColumnType.Number).ToList();
        var categories = columns.Where(c => c.Type == ColumnType.Category).ToList();

        int id = 1;

        // 1. Line chart: first date × first number
        if (dates.Count > 0 && numbers.Count > 0)
        {
            var dateCol = dates[0];
            var numCol = numbers[0];
            var data = AggregateByDate(rows, dateCol.Name, numCol.Name);
            charts.Add(new ChartSpec($"chart-{id++}", "LineChart",
                $"{numCol.Name} over {dateCol.Name}", dateCol.Name, numCol.Name, data));
        }

        // 2. Bar chart: first category × first number
        if (categories.Count > 0 && numbers.Count > 0)
        {
            var catCol = categories[0];
            var numCol = numbers[0];
            var data = AggregateByCategory(rows, catCol.Name, numCol.Name);
            charts.Add(new ChartSpec($"chart-{id++}", "BarChart",
                $"{numCol.Name} by {catCol.Name}", catCol.Name, numCol.Name, data));
        }

        // 3. Second line/bar if a second number column exists
        if (numbers.Count > 1 && dates.Count > 0)
        {
            var dateCol = dates[0];
            var numCol = numbers[1];
            var data = AggregateByDate(rows, dateCol.Name, numCol.Name);
            charts.Add(new ChartSpec($"chart-{id++}", "LineChart",
                $"{numCol.Name} over {dateCol.Name}", dateCol.Name, numCol.Name, data));
        }
        else if (numbers.Count > 1 && categories.Count > 0)
        {
            var catCol = categories[0];
            var numCol = numbers[1];
            var data = AggregateByCategory(rows, catCol.Name, numCol.Name);
            charts.Add(new ChartSpec($"chart-{id++}", "BarChart",
                $"{numCol.Name} by {catCol.Name}", catCol.Name, numCol.Name, data));
        }

        // 4. Pie chart: second category distribution
        if (categories.Count > 1)
        {
            var catCol = categories[1];
            var data = CategoryDistribution(rows, catCol.Name);
            charts.Add(new ChartSpec($"chart-{id++}", "PieChart",
                $"{catCol.Name} Distribution", catCol.Name, "value", data));
        }
        else if (categories.Count == 1 && numbers.Count == 0 && dates.Count == 0)
        {
            var catCol = categories[0];
            var data = CategoryDistribution(rows, catCol.Name);
            charts.Add(new ChartSpec($"chart-{id++}", "PieChart",
                $"{catCol.Name} Distribution", catCol.Name, "value", data));
        }

        // 5. Scatter: two numbers, no date/category
        if (numbers.Count >= 2 && dates.Count == 0 && categories.Count == 0 && charts.Count < 2)
        {
            var data = rows.Select(r => new Dictionary<string, object>
            {
                [numbers[0].Name] = TryNum(r, numbers[0].Name),
                [numbers[1].Name] = TryNum(r, numbers[1].Name),
            }).ToList();
            charts.Add(new ChartSpec($"chart-{id++}", "ScatterChart",
                $"{numbers[0].Name} vs {numbers[1].Name}",
                numbers[0].Name, numbers[1].Name, data));
        }

        return charts.Take(4).ToList();
    }

    private List<Dictionary<string, object>> AggregateByDate(
        List<Dictionary<string, string>> rows, string dateCol, string numCol)
    {
        return rows
            .Where(r => !string.IsNullOrWhiteSpace(r.GetValueOrDefault(dateCol))
                     && double.TryParse(r.GetValueOrDefault(numCol, "")
                            .Replace(",", ""), out _))
            .GroupBy(r =>
            {
                var raw = r[dateCol];
                if (DateTime.TryParse(raw, out var d)) return d.ToString("yyyy-MM");
                return raw;
            })
            .OrderBy(g => g.Key)
            .Select(g => new Dictionary<string, object>
            {
                [dateCol] = g.Key,
                [numCol] = Math.Round(g.Average(r =>
                    double.TryParse(r[numCol].Replace(",", ""), out var n) ? n : 0), 2)
            })
            .ToList();
    }

    private static List<Dictionary<string, object>> AggregateByCategory(
        List<Dictionary<string, string>> rows, string catCol, string numCol)
    {
        return rows
            .Where(r => !string.IsNullOrWhiteSpace(r.GetValueOrDefault(catCol)))
            .GroupBy(r => r[catCol], StringComparer.OrdinalIgnoreCase)
            .OrderByDescending(g => g.Sum(r =>
                double.TryParse(r.GetValueOrDefault(numCol, "").Replace(",", ""), out var n) ? n : 0))
            .Take(12)
            .Select(g => new Dictionary<string, object>
            {
                [catCol] = g.Key,
                [numCol] = Math.Round(g.Sum(r =>
                    double.TryParse(r.GetValueOrDefault(numCol, "").Replace(",", ""), out var n) ? n : 0), 2)
            })
            .ToList();
    }

    private static List<Dictionary<string, object>> CategoryDistribution(
        List<Dictionary<string, string>> rows, string catCol)
    {
        return rows
            .Where(r => !string.IsNullOrWhiteSpace(r.GetValueOrDefault(catCol)))
            .GroupBy(r => r[catCol], StringComparer.OrdinalIgnoreCase)
            .OrderByDescending(g => g.Count())
            .Take(8)
            .Select(g => new Dictionary<string, object>
            {
                ["name"] = g.Key,
                ["value"] = g.Count()
            })
            .ToList();
    }

    private static double TryNum(Dictionary<string, string> row, string col) =>
        double.TryParse(row.GetValueOrDefault(col, "").Replace(",", ""), out var n) ? n : 0;
}
