FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "papelaria-backend.sln"
RUN dotnet publish "papelaria-backend.sln" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5218
ENTRYPOINT ["dotnet", "papelaria-backend.dll"]