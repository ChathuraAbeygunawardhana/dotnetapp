using BIDashboard.Models;
using BIDashboard.Services;
using Microsoft.AspNetCore.Mvc;

namespace BIDashboard.Controllers;

[ApiController]
[Route("api")]
public class UploadController(
    FileParserService parser,
    ColumnAnalyzerService analyzer,
    StatisticsService statistics,
    ChartSpecBuilder chartBuilder,
    InsightGenerator insights) : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "ok" });

    [HttpPost("upload")]
    [RequestSizeLimit(50 * 1024 * 1024)] // 50 MB
    public IActionResult Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "No file provided." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext is not (".csv" or ".xlsx" or ".xls"))
            return BadRequest(new { error = "Only CSV and Excel files are supported." });

        try
        {
            // 1. Parse
            var (headers, rows) = parser.Parse(file);
            if (rows.Count == 0)
                return BadRequest(new { error = "The file is empty or has no data rows." });

            // 2. Analyse columns
            var columns = headers.Select(h =>
            {
                var vals = rows.Select(r => r.TryGetValue(h, out var v) ? v : "");
                var type = analyzer.Detect(vals);
                return new ColumnInfo(h, type);
            }).ToList();

            // 3. Stats
            var stats = statistics.Compute(headers, columns, rows);

            // 4. Charts
            var charts = chartBuilder.Build(columns, rows);

            // 5. Insights
            var insightList = insights.Generate(rows.Count, columns, stats, rows);

            // 6. Preview (first 50 rows as object dicts)
            var preview = rows.Take(50)
                .Select(r => r.ToDictionary(kv => kv.Key, kv => (object)kv.Value))
                .ToList();

            return Ok(new AnalysisResult(rows.Count, columns, stats, charts, insightList, preview));
        }
        catch (NotSupportedException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Failed to process file: {ex.Message}" });
        }
    }
}
