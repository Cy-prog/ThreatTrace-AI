package com.threattrace.dto.response;

import java.util.ArrayList;
import java.util.List;

public class CorrelationGraphResponse {

    private List<GraphNode> nodes = new ArrayList<>();
    private List<GraphLink> links = new ArrayList<>();

    public CorrelationGraphResponse() {}

    public CorrelationGraphResponse(List<GraphNode> nodes, List<GraphLink> links) {
        this.nodes = nodes;
        this.links = links;
    }

    public List<GraphNode> getNodes() { return nodes; }
    public void setNodes(List<GraphNode> nodes) { this.nodes = nodes; }

    public List<GraphLink> getLinks() { return links; }
    public void setLinks(List<GraphLink> links) { this.links = links; }

    public static class GraphNode {
        private String id;
        private String label;
        private String type; // THREAT, ENTITY, LOCATION, ORGANIZATION, ALERT
        private String severity;
        private Integer riskScore;

        public GraphNode() {}

        public GraphNode(String id, String label, String type, String severity, Integer riskScore) {
            this.id = id;
            this.label = label;
            this.type = type;
            this.severity = severity;
            this.riskScore = riskScore;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }

        public Integer getRiskScore() { return riskScore; }
        public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    }

    public static class GraphLink {
        private String source;
        private String target;
        private String relation;
        private Double weight;

        public GraphLink() {}

        public GraphLink(String source, String target, String relation, Double weight) {
            this.source = source;
            this.target = target;
            this.relation = relation;
            this.weight = weight;
        }

        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }

        public String getTarget() { return target; }
        public void setTarget(String target) { this.target = target; }

        public String getRelation() { return relation; }
        public void setRelation(String relation) { this.relation = relation; }

        public Double getWeight() { return weight; }
        public void setWeight(Double weight) { this.weight = weight; }
    }
}
