# Employee Time Tracking

## C# application

```powershell
cd EmployeeTimeTracker
$env:ApiSettings__ApiKey = "your_api_key"
dotnet run
```

Open [http://localhost:5290](http://localhost:5290).

## Angular application

Replace `MY_API_KEY` in `employee-hours/src/environments/environment.ts` with your API key, then run:

```powershell
cd employee-hours
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). The API only accepts browser requests from this port.
