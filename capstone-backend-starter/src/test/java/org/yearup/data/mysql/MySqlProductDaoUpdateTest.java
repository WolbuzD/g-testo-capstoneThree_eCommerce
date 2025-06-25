package org.yearup.data.mysql;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.yearup.models.Product;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MySqlProductDaoUpdateTest extends BaseDaoTestClass
{
    private MySqlProductDao dao;

    @BeforeEach
    public void setup()
    {
        dao = new MySqlProductDao(dataSource);
    }

    @Test
    public void update_shouldUpdateExistingProduct_notCreateNew()
    {
        // Arrange - Get the original product
        int productId = 1; // Smartphone
        Product originalProduct = dao.getById(productId);
        assertNotNull(originalProduct, "Original product should exist");

        // Count total products before update
        List<Product> allProductsBefore = dao.search(null, null, null, null);
        int countBefore = allProductsBefore.size();

        // Create updated product with new price and description
        Product updatedProduct = new Product();
        updatedProduct.setProductId(productId);
        updatedProduct.setName("Updated Smartphone");
        updatedProduct.setPrice(new BigDecimal("599.99")); // Changed from 499.99
        updatedProduct.setCategoryId(originalProduct.getCategoryId());
        updatedProduct.setDescription("An updated powerful smartphone"); // Changed description
        updatedProduct.setColor(originalProduct.getColor());
        updatedProduct.setImageUrl(originalProduct.getImageUrl());
        updatedProduct.setStock(originalProduct.getStock());
        updatedProduct.setFeatured(originalProduct.isFeatured());

        // Act - Update the product
        dao.update(productId, updatedProduct);

        // Assert - Verify the product was updated, not duplicated
        Product retrievedProduct = dao.getById(productId);
        List<Product> allProductsAfter = dao.search(null, null, null, null);
        int countAfter = allProductsAfter.size();

        // Check that no new product was created
        assertEquals(countBefore, countAfter, "Product count should remain the same - no duplicates created");

        // Check that the existing product was actually updated
        assertNotNull(retrievedProduct, "Updated product should still exist");
        assertEquals("Updated Smartphone", retrievedProduct.getName(), "Product name should be updated");
        assertEquals(new BigDecimal("599.99"), retrievedProduct.getPrice(), "Product price should be updated");
        assertEquals("An updated powerful smartphone", retrievedProduct.getDescription(), "Product description should be updated");
        assertEquals(productId, retrievedProduct.getProductId(), "Product ID should remain the same");
    }

    @Test
    public void update_shouldNotCreateDuplicateProducts()
    {
        // Arrange - Count products with name "Smartphone"
        List<Product> allProducts = dao.search(null, null, null, null);
        long smartphoneCountBefore = allProducts.stream()
                .filter(p -> p.getName().contains("Smartphone"))
                .count();

        int productId = 1;
        Product originalProduct = dao.getById(productId);

        // Create an update
        Product updatedProduct = new Product();
        updatedProduct.setName("Super Smartphone");
        updatedProduct.setPrice(new BigDecimal("699.99"));
        updatedProduct.setCategoryId(originalProduct.getCategoryId());
        updatedProduct.setDescription("A super powerful smartphone");
        updatedProduct.setColor(originalProduct.getColor());
        updatedProduct.setImageUrl(originalProduct.getImageUrl());
        updatedProduct.setStock(originalProduct.getStock());
        updatedProduct.setFeatured(originalProduct.isFeatured());

        // Act - Update the product
        dao.update(productId, updatedProduct);

        // Assert - Check that no duplicate was created
        List<Product> allProductsAfter = dao.search(null, null, null, null);
        long smartphoneCountAfter = allProductsAfter.stream()
                .filter(p -> p.getName().contains("Smartphone"))
                .count();

        assertEquals(smartphoneCountBefore, smartphoneCountAfter,
                "Should not create duplicate smartphone products");
    }
}