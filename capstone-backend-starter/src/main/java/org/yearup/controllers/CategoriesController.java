package org.yearup.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.yearup.data.CategoryDao;
import org.yearup.data.ProductDao;
import org.yearup.models.Category;
import org.yearup.models.Product;

import java.util.List;

// add the annotations to make this a REST controller
// add the annotation to make this controller the endpoint for the following url
// http://localhost:8080/categories
// add annotation to allow cross site origin requests
@RestController
@RequestMapping("/categories")
@CrossOrigin
public class CategoriesController
{
    private CategoryDao categoryDao;
    private ProductDao productDao;

    // create an Autowired controller to inject the categoryDao and ProductDao
    @Autowired
    public CategoriesController(CategoryDao categoryDao, ProductDao productDao) {
        this.categoryDao = categoryDao;
        this.productDao = productDao;
    }

    // add the appropriate annotation for a get action
    @GetMapping
    public List<Category> getAll()
    {
        // find and return all categories
        return categoryDao.getAllCategories();
    }

    // add the appropriate annotation for a get action
    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable int id)
    {
        // get the category by id
        Category category = categoryDao.getById(id);
        if (category == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
        return ResponseEntity.ok(category); // 200 OK with category data
    }

    // the url to return all products in category 1 would look like this
    // https://localhost:8080/categories/1/products
    @GetMapping("/{categoryId}/products")
    public List<Product> getProductsById(@PathVariable int categoryId)
    {
        // get a list of product by categoryId
        return productDao.listByCategoryId(categoryId);

    }

    // add annotation to call this method for a POST action
    // add annotation to ensure that only an ADMIN can call this function
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Category> addCategory(@RequestBody Category category)
    {
        try {
            Category createdCategory = categoryDao.create(category);
            return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create category: " + e.getMessage());
        }
    }

    // add annotation to call this method for a PUT (update) action - the url path must include the categoryId
    // add annotation to ensure that only an ADMIN can call this function
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public void updateCategory(@PathVariable int id, @RequestBody Category category)
    {
        // update the category by id
        categoryDao.update(id, category);
    }

    // add annotation to call this method for a DELETE action - the url path must include the categoryId
    // add annotation to ensure that only an ADMIN can call this function
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable int id)
    {
        try
        {
            // Check if category exists
            Category category = categoryDao.getById(id);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Category not found");
            }

            // Check if category has products
            List<Product> products = productDao.listByCategoryId(id);
            if (!products.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Cannot delete category '" + category.getName() +
                                "'. It contains " + products.size() +
                                " products. Please remove all products first.");
            }

            categoryDao.delete(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting category: " + e.getMessage());
        }
    }
}