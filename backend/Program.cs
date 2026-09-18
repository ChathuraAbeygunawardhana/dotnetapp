using BIDashboard.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Port ─────────────────────────────────────────────────────────────────────
var port = Environment.GetEnvironmentVariable("PORT") ?? "80";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ── Services ─────────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()));
builder.Services.AddSingleton<FileParserService>();
builder.Services.AddSingleton<ColumnAnalyzerService>();
builder.Services.AddSingleton<StatisticsService>();
builder.Services.AddSingleton<ChartSpecBuilder>();
builder.Services.AddSingleton<InsightGenerator>();

// ── CORS (allow any origin for dev/Vercel) ───────────────────────────────────
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// ── File upload limit (50 MB) ─────────────────────────────────────────────────
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o =>
{
    o.MultipartBodyLengthLimit = 50 * 1024 * 1024;
});

// ── Build ─────────────────────────────────────────────────────────────────────
var app = builder.Build();

app.UseCors();
app.MapControllers();

// Keep the original hello route for backwards compatibility
app.MapGet("/", () => Results.Json(new { message = "BI Dashboard API" }));

app.Run();
