# Budget Alert Backend

This is the Spring Boot backend for the Budget Alert application. It provides RESTful APIs for user authentication, expense management, and budget tracking.

## Technologies Used

- Java 17
- Spring Boot 3.2.5
- Spring Data JPA
- H2 Database (in-memory)
- Maven

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── pennywise/
│   │   │           └── pw/
│   │   │               ├── config/
│   │   │               │   ├── DataInitializer.java
│   │   │               │   └── WebConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── BudgetController.java
│   │   │               │   ├── ExpenseController.java
│   │   │               │   └── UserController.java
│   │   │               ├── model/
│   │   │               │   ├── Budget.java
│   │   │               │   ├── Expense.java
│   │   │               │   └── User.java
│   │   │               ├── repository/
│   │   │               │   ├── BudgetRepository.java
│   │   │               │   ├── ExpenseRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── service/
│   │   │               │   ├── BudgetService.java
│   │   │               │   ├── ExpenseService.java
│   │   │               │   └── UserService.java
│   │   │               └── PwApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## API Endpoints

### User Management

- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Authenticate a user
- `GET /api/users/{username}` - Get user details

### Expense Management

- `GET /api/expenses?username={username}` - Get all expenses for a user
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/{id}` - Update an existing expense
- `DELETE /api/expenses/{id}?username={username}` - Delete an expense

### Budget Management

- `GET /api/budgets?username={username}` - Get all budgets for a user
- `GET /api/budgets?username={username}&month={YYYY-MM}` - Get budgets for a specific month
- `POST /api/budgets` - Create a new budget (or update if exists for same category/month)
- `PUT /api/budgets/{id}` - Update an existing budget
- `DELETE /api/budgets/{id}?username={username}` - Delete a budget

## How to Run

1. Make sure you have Java 17 and Maven installed
2. Navigate to the backend directory
3. Run the following command:

```bash
mvn spring-boot:run
```

The application will start on port 8080.

## Sample Data

The application initializes with sample data for demonstration purposes:

- **Users**:
  - Demo User: username `demo`, email `demo@example.com`, password `password`
  - Admin User: username `admin`, email `admin@example.com`, password `admin`

- **Expenses**: Several sample expenses for the demo user in various categories

- **Budgets**: Sample monthly budgets for the demo user in categories like food, transportation, entertainment, etc.

## H2 Database Console

You can access the H2 database console at http://localhost:8080/h2-console with the following credentials:

- JDBC URL: `jdbc:h2:mem:budgetdb`
- Username: `sa`
- Password: `password`

## Integration with Frontend

The backend is configured to allow CORS requests from the frontend running on http://localhost:8081. If your frontend runs on a different port, update the `WebConfig.java` file accordingly.
