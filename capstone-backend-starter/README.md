# EasyShop E-Commerce API

A comprehensive Spring Boot REST API for an e-commerce platform supporting user management, product catalog, shopping cart, and order processing.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** (JWT-based)
- **Product Management** (CRUD operations)
- **Category Management** (CRUD operations)
- **Shopping Cart** (Persistent, user-specific)
- **Order Processing** (Checkout functionality)
- **User Profiles** (Account management)

### Security Features
- Role-based access control (USER/ADMIN)
- JWT token authentication
- Password encryption (BCrypt)
- Protected admin-only endpoints

### Database Features
- MySQL database integration
- Foreign key constraints
- Transaction management
- Data validation

## 🛠️ Technology Stack

- **Framework:** Spring Boot 2.7.3
- **Security:** Spring Security + JWT
- **Database:** MySQL 8.0
- **ORM:** Spring JDBC
- **Build Tool:** Maven
- **Java Version:** 17

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA recommended)

## ⚙️ Setup Instructions

### 1. Database Setup
```sql
-- Run the database creation script
USE sys;
SOURCE /path/to/database/create_database.sql;
```

### 2. Application Configuration
Update `src/main/resources/application.properties`:
```properties
datasource.url=jdbc:mysql://localhost:3306/easyshop
datasource.username=your_username
datasource.password=your_password
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

## 🔧 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | User registration | Public |
| POST | `/login` | User login | Public |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/categories` | Get all categories | Public |
| GET | `/categories/{id}` | Get category by ID | Public |
| GET | `/categories/{id}/products` | Get products in category | Public |
| POST | `/categories` | Create category | Admin |
| PUT | `/categories/{id}` | Update category | Admin |
| DELETE | `/categories/{id}` | Delete category | Admin |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/products` | Search products | Public |
| GET | `/products/{id}` | Get product by ID | Public |
| POST | `/products` | Create product | Admin |
| PUT | `/products/{id}` | Update product | Admin |
| DELETE | `/products/{id}` | Delete product | Admin |

### Shopping Cart
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/cart` | Get user's cart | User |
| POST | `/cart/products/{id}` | Add product to cart | User |
| PUT | `/cart/products/{id}` | Update cart item | User |
| DELETE | `/cart` | Clear cart | User |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/orders` | Checkout (create order) | User |
| GET | `/orders` | Get user's orders | User |

### Profile
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/profile` | Get user profile | User |
| PUT | `/profile` | Update user profile | User |

## 🔍 Search & Filter Parameters

### Product Search
```
GET /products?cat=1&minPrice=25&maxPrice=100&color=Black
```

**Parameters:**
- `cat` - Category ID filter
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `color` - Color filter

## 🧪 Testing

### Sample Users
The database includes pre-configured users:

| Username | Password | Role |
|----------|----------|------|
| admin | password | ADMIN |
| user | password | USER |
| george | password | USER |

### Authentication Example
```bash
# Register new user
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "confirmPassword": "password123", 
    "role": "USER"
  }'

# Login
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

## 🐛 Bug Fixes Implemented

### 1. Product Search Bug
**Issue:** Search functionality was returning incorrect results
**Fix:** Implemented proper SQL query building with parameter validation

### 2. Product Update Bug
**Issue:** Product updates were creating new records instead of updating existing ones
**Fix:** Modified `MySqlProductDao.update()` to use UPDATE statement with proper WHERE clause

### 3. Category Deletion Bug
**Issue:** Foreign key constraint violations when deleting categories with products
**Fix:** Added validation to prevent deletion of categories containing products with clear error messages

## 💡 Interesting Code Snippet

### Smart Shopping Cart Management
```java
@Override
public void addProduct(int userId, int productId) {
    String selectSql = "SELECT quantity FROM shopping_cart WHERE user_id = ? AND product_id = ?";
    String insertSql = "INSERT INTO shopping_cart (user_id, product_id, quantity) VALUES (?, ?, 1)";
    String updateSql = "UPDATE shopping_cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";

    try (Connection connection = getConnection()) {
        PreparedStatement select = connection.prepareStatement(selectSql);
        select.setInt(1, userId);
        select.setInt(2, productId);
        ResultSet result = select.executeQuery();

        if (result.next()) {
            // Product exists in cart - increment quantity
            PreparedStatement update = connection.prepareStatement(updateSql);
            update.setInt(1, userId);
            update.setInt(2, productId);
            update.executeUpdate();
        } else {
            // New product - add to cart
            PreparedStatement insert = connection.prepareStatement(insertSql);
            insert.setInt(1, userId);
            insert.setInt(2, productId);
            insert.executeUpdate();
        }
    }
}
```

This method intelligently handles adding products to the cart by checking if the item already exists and either incrementing the quantity or adding a new item accordingly.

## 🚀 Future Enhancements

- Product reviews and ratings
- Inventory management
- Order tracking
- Payment processing integration
- Product recommendations
- Search autocomplete
- Admin dashboard
- Email notifications

## 📝 Project Structure

```
src/
├── main/
│   ├── java/org/yearup/
│   │   ├── controllers/     # REST controllers
│   │   ├── data/           # DAO interfaces & implementations
│   │   ├── models/         # Entity classes
│   │   ├── security/       # Security configuration
│   │   └── configurations/ # Spring configurations
│   └── resources/
│       ├── application.properties
│       └── banner.txt
└── test/
    └── java/org/yearup/
        └── data/mysql/     # Unit tests
```

## 📄 License

This project is part of a Java Development Bootcamp capstone project.

---

**Developed by:** [Your Name]  
**Course:** Java Development Bootcamp  
**Project:** Capstone 3 - E-Commerce API