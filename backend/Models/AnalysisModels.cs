namespace BIDashboard.Models;

public record ColumnInfo(string Name, ColumnType Type);

public enum ColumnType { Date, Number, Category, Unknown }

public record StatSummary(
    string Column,
    double? Min,
    double? Max,
    double? Mean,
    double? Sum,
    string? TopCategory,
    int? TopCategoryCount
);

public record ChartSpec(
    string Id,
    string Type,       // "LineChart" | "BarChart" | "PieChart" | "ScatterChart"
    string Title,
    string XKey,
    string YKey,
    List<Dictionary<string, object>> Data
);

public record AnalysisResult(
    int RowCount,
    List<ColumnInfo> Columns,
    List<StatSummary> Stats,
    List<ChartSpec> Charts,
    List<string> Insights,
    List<Dictionary<string, object>> Preview
);
