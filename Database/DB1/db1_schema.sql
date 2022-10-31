DROP TABLE IF EXISTS
    Roles, Tokens, Users, Credentials, Permissions, RolePermissions, MedicalHistories
CASCADE;

CREATE TABLE Roles (
    rid INTEGER PRIMARY KEY,
    rname CHARACTER VARYING(255) NOT NULL
);

CREATE TABLE Tokens (
    tid MACADDR PRIMARY KEY,
    assignedDate DATE,
    status INTEGER
);

CREATE TABLE Credentials (
    uid INTEGER PRIMARY KEY,
    password_hash CHARACTER VARYING(255) NOT NULL,
    username CHARACTER VARYING(255) UNIQUE
);

CREATE TABLE Users (
    uid INTEGER PRIMARY KEY,
    nric CHAR(9) UNIQUE NOT NULL,
    name CHARACTER VARYING(255) NOT NULL,
    email CHARACTER VARYING(255) NOT NULL,
    contact_no INTEGER NOT NULL,
    gender VARCHAR(6) NOT NULL,
    date_of_birth DATE,
    address CHARACTER VARYING(255),
    zipcode INTEGER,
    quarantineUntil DATE,
    accountStatus INTEGER,
    failedLoginFrequency INTEGER,
    tid MACADDR UNIQUE DEFAULT NULL,
    rid INTEGER,
    FOREIGN KEY (uid) REFERENCES Credentials (uid),
    FOREIGN KEY (tid) REFERENCES Tokens (tid) ON DELETE SET NULL,
    FOREIGN KEY (rid) REFERENCES Roles (rid) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Permissions (
    pid INTEGER PRIMARY KEY,
    pname CHARACTER VARYING(255) NOT NULL
);

CREATE TABLE RolePermissions (
    pid INTEGER,
    rid INTEGER,
    PRIMARY KEY (pid, rid),
    FOREIGN KEY (pid) REFERENCES Permissions (pid) ON DELETE CASCADE,
    FOREIGN KEY (rid) REFERENCES Roles (rid) ON DELETE CASCADE
);

CREATE TABLE MedicalHistories (
    uid INTEGER PRIMARY KEY,
    vaccination_history CHARACTER VARYING(255),
    recent_test_result CHARACTER VARYING(8) DEFAULT NULL,
    FOREIGN KEY (uid) REFERENCES Credentials (uid)
);
 
