var builder = WebApplication.CreateSlimBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "80";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Allow browser requests from any origin (public read-only API)
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

app.UseCors();

app.MapGet("/", () => Results.Json(new { message = "Hello from .NET on Vercel" }));
app.MapGet("/health", () => Results.Json(new { status = "ok" }));

app.Run();
