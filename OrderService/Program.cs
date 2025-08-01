using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OrderService.GraphQL.Mutations;
using OrderService.GraphQL.Queries;
using OrderService.GraphQL.Subscriptions;
using OrderService.Services;
using OrderService.Models;
using OrderService.Kafka;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddSingleton<OrderService.Services.OrderService>();
builder.Services.AddSingleton<KafkaProducer>();
builder.Services.AddSingleton<KafkaConsumer>();
builder.Services.AddHostedService(provider => provider.GetRequiredService<KafkaConsumer>());

builder.Services
    .AddGraphQLServer()
    .AddQueryType<OrderQuery>()
    .AddMutationType<OrderMutation>()
    .AddSubscriptionType<OrderSubscription>()
    .AddInMemorySubscriptions();

var app = builder.Build();
app.UseCors("AllowFrontend");
app.UseWebSockets();
app.MapGraphQL();
app.Run();