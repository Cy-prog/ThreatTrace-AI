import re
from typing import List
from app.schemas.entities import ExtractedEntity

class ThreatNERModel:
    def __init__(self):
        # Compiled patterns for entities
        self.email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        self.url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')
        self.btc_pattern = re.compile(r'\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b')
        self.phone_pattern = re.compile(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b')
        
        # Temporal patterns
        self.time_pattern = re.compile(r'\b(?:at\s+)?(\d{1,2}:\d{2}(?:\s*(?:AM|PM|EST|PST|UTC|GMT))?|tonight|tomorrow|today|midnight|noon)\b', re.IGNORECASE)
        self.date_pattern = re.compile(r'\b(?:(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?|\d{1,2}/\d{1,2}/\d{2,4}|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b', re.IGNORECASE)
        
        # Facility / Infrastructure
        self.facility_pattern = re.compile(r'\b(?:Central\s+Metro\s+Station|Metro\s+Station|Airport|Terminal|Water\s+Treatment\s+Plant|Power\s+Plant|Substation|Headquarters|HQ|Data\s+Center|Hospital|Campus|Reservoir|Tunnel|Bridge)\b', re.IGNORECASE)
        
        # Known Geographic locations
        self.location_pattern = re.compile(r'\b(?:Chicago|New\s+York|Seattle|Frankfurt|London|Washington|Tokyo|Berlin|Paris|Mumbai|Delhi|Bangalore|Singapore|Houston|Atlanta|Los\s+Angeles|Dallas|IL|NY|WA|USA|Germany|UK|India)\b')
        
        # Organizations
        self.org_pattern = re.compile(r'\b(?:Meridian\s+Financial|Apex\s+Tech|Microsoft|Google|Amazon|Apple|FBI|DHS|CISA|Interpol|Police|SWAT|Transit\s+Authority)\b', re.IGNORECASE)
        
        # Vehicles
        self.vehicle_pattern = re.compile(r'\b(?:black\s+sedan|SUV|white\s+van|truck|license\s+plate\s+[A-Z0-9-]+)\b', re.IGNORECASE)

    def extract_entities(self, text: str) -> List[ExtractedEntity]:
        entities: List[ExtractedEntity] = []
        seen_spans = set()

        def add_entity(etype: str, val: str, start: int, end: int, conf: float):
            span_key = (start, end)
            if span_key not in seen_spans:
                seen_spans.add(span_key)
                entities.append(ExtractedEntity(
                    entity_type=etype,
                    entity_value=val,
                    confidence=conf,
                    start_offset=start,
                    end_offset=end,
                    source_span=text[start:end]
                ))

        # 1. Emails
        for m in self.email_pattern.finditer(text):
            add_entity("EMAIL", m.group(0), m.start(), m.end(), 0.99)

        # 2. URLs
        for m in self.url_pattern.finditer(text):
            add_entity("URL", m.group(0), m.start(), m.end(), 0.98)

        # 3. Crypto / Wallet addresses
        for m in self.btc_pattern.finditer(text):
            add_entity("URL", m.group(0), m.start(), m.end(), 0.99)

        # 4. Phone numbers
        for m in self.phone_pattern.finditer(text):
            add_entity("PHONE", m.group(0), m.start(), m.end(), 0.94)

        # 5. Facilities
        for m in self.facility_pattern.finditer(text):
            add_entity("FACILITY", m.group(0), m.start(), m.end(), 0.92)

        # 6. Locations
        for m in self.location_pattern.finditer(text):
            add_entity("LOCATION", m.group(0), m.start(), m.end(), 0.96)

        # 7. Organizations
        for m in self.org_pattern.finditer(text):
            add_entity("ORGANIZATION", m.group(0), m.start(), m.end(), 0.94)

        # 8. Dates
        for m in self.date_pattern.finditer(text):
            add_entity("DATE", m.group(0), m.start(), m.end(), 0.91)

        # 9. Times
        for m in self.time_pattern.finditer(text):
            add_entity("TIME", m.group(0), m.start(), m.end(), 0.90)

        # 10. Vehicles
        for m in self.vehicle_pattern.finditer(text):
            add_entity("VEHICLE", m.group(0), m.start(), m.end(), 0.88)

        return sorted(entities, key=lambda e: e.start_offset)
