package com.jee.clinichub.app.catalog.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import com.jee.clinichub.app.catalog.product.model.ProductSearch;
import com.jee.clinichub.app.catalog.product.model.ProductViewDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

public class ProductAdvanceRepositoryImpl implements ProductAdvanceRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<ProductViewDTO> searchProducts(Pageable pageable, ProductSearch search) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProductViewDTO> query = cb.createQuery(ProductViewDTO.class);
        Root<ProductViewDTO> product = query.from(ProductViewDTO.class);

        List<Predicate> predicates = new ArrayList<>();

        if (search.getName() != null) {
            predicates.add(cb.like(cb.lower(product.get("name")), "%" + search.getName().toLowerCase() + "%"));
        }
        if (search.getCategory() != null && search.getCategory().getId() != null) {
            predicates.add(cb.equal(product.get("categoryId"), search.getCategory().getId()));
        }
        if (search.getBrand() != null && search.getBrand().getId() != null) {
            predicates.add(cb.equal(product.get("brandId"), search.getBrand().getId()));
        }
        if (search.getType() != null && search.getType().getId() != null) {
            predicates.add(cb.equal(product.get("typeId"), search.getType().getId()));
        }

        if (search.getAvailable() != null) {
            if (search.getAvailable() == 0) {
                predicates.add(cb.greaterThanOrEqualTo(product.get("qty"), 0));
            } else if (search.getAvailable() == 2) {
                predicates.add(cb.equal(product.get("qty"), 0));
            } else if (search.getAvailable() == 3) {
                predicates.add(cb.between(product.get("qty"), 1, 3));
            } else if (search.getAvailable() == 1) {
                predicates.add(cb.greaterThanOrEqualTo(product.get("qty"), 4));
            }
        }

        Integer expiry = search.getExpiry();
        if (expiry != null && expiry != -1) {
            predicates.add(cb.equal(product.get("expiryMonth"), expiry));
        }

        query.where(predicates.toArray(new Predicate[0]));

        // Apply pagination
        List<ProductViewDTO> resultList = entityManager.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // Create a new CriteriaQuery and Root for the count query
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<ProductViewDTO> countRoot = countQuery.from(ProductViewDTO.class);

        // Create a new list of predicates for the count query
        List<Predicate> countPredicates = new ArrayList<>();

        if (search.getName() != null) {
            countPredicates.add(cb.like(cb.lower(countRoot.get("name")), "%" + search.getName().toLowerCase() + "%"));
        }
        if (search.getCategory() != null && search.getCategory().getId() != null) {
            countPredicates.add(cb.equal(countRoot.get("categoryId"), search.getCategory().getId()));
        }
        if (search.getBrand() != null && search.getBrand().getId() != null) {
            countPredicates.add(cb.equal(countRoot.get("brandId"), search.getBrand().getId()));
        }
        if (search.getType() != null && search.getType().getId() != null) {
            countPredicates.add(cb.equal(countRoot.get("typeId"), search.getType().getId()));
        }

        if (search.getAvailable() != null) {
            if (search.getAvailable() == 0) {
                countPredicates.add(cb.greaterThanOrEqualTo(countRoot.get("qty"), 0));
            } else if (search.getAvailable() == 2) {
                countPredicates.add(cb.equal(countRoot.get("qty"), 0));
            } else if (search.getAvailable() == 3) {
                countPredicates.add(cb.between(countRoot.get("qty"), 1, 3));
            } else if (search.getAvailable() == 1) {
                countPredicates.add(cb.greaterThanOrEqualTo(countRoot.get("qty"), 4));
            }
        }

        if (expiry != null && expiry != -1) {
            countPredicates.add(cb.equal(countRoot.get("expiryMonth"), expiry));
        }

        countQuery.select(cb.count(countRoot)).where(countPredicates.toArray(new Predicate[0]));
        Long count = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, pageable, count);
    }
}