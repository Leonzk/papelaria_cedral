# filepath: d:\Trabalhos_GitHub\papelaria_cedral\papelaria-backend\Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "papelaria-backend.sln"
RUN dotnet publish "papelaria-backend.sln" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "papelaria-backend.dll"]