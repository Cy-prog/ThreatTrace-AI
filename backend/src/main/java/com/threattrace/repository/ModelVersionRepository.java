package com.threattrace.repository;

import com.threattrace.entity.ModelVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelVersionRepository extends JpaRepository<ModelVersion, String> {
    List<ModelVersion> findByStatus(String status);
    Optional<ModelVersion> findFirstByModelNameAndStatusOrderByDeployedAtDesc(String modelName, String status);
}
