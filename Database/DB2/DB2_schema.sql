DROP TABLE IF EXISTS
  Tokens, TracingRecords
CASCADE;

CREATE TABLE Tokens (
    tid MACADDR PRIMARY KEY,
    assignedDate DATE,
    status INTEGER
);

CREATE TABLE TracingRecords (
  traceRecordId INTEGER PRIMARY KEY,
  tokenID MACADDR,
  time TIMESTAMP,
  location VARCHAR(255),
  rssi VARCHAR(6),
  FOREIGN KEY (tokenID) REFERENCES Tokens (tid)
);

