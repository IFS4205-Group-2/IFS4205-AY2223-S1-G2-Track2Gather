CREATE OR REPLACE PROCEDURE add_permission
(id INT, name VARCHAR(255))
AS $$
BEGIN
  INSERT INTO Permissions (pid, pname) VALUES (id, name);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE remove_permission (id INT)
AS $$
BEGIN
  DELETE FROM Permissions WHERE pid = id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_permission 
(id INT, new_name VARCHAR(255))
AS $$
BEGIN
  UPDATE Permissions SET pname = new_name WHERE pid = id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_role (id INT, name VARCHAR(255))
AS $$
BEGIN
  INSERT INTO Roles (rid, rname) VALUES (id, name);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE remove_role (id INT)
AS $$
BEGIN
  DELETE FROM Roles WHERE rid = id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_role (id INT, name VARCHAR(255))
AS $$
BEGIN
  UPDATE Roles SET rname = name WHERE rid = id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_rolePermission
(rid INT, pid INT)
AS $$
BEGIN
  INSERT INTO RolePermissions (pid, rid) VALUES (pid, rid);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE remove_rolePermission
(rid MACADDR, pid INT)
AS $$
BEGIN
  DELETE FROM RolePermissions WHERE rid = rid AND pid = pid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_token 
(id MACADDR, assignedDate DATE)
AS $$
BEGIN
  INSERT INTO Tokens (tid, assignedDate, status) VALUES (id, assignedDate, 1);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE deactivate_token (id MACADDR)
AS $$
BEGIN
  UPDATE Tokens SET status = 0 WHERE tid = id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_user
(uid int, nric CHAR(9), name VARCHAR(255), email VARCHAR(255), contact_no INTEGER, gender VARCHAR(6), date_of_birth DATE, address VARCHAR(255), zipcode INTEGER, rid INTEGER)
AS $$
BEGIN
  INSERT INTO Users (uid, nric, name, email, contact_no, gender, date_of_birth, address, zipcode, quarantineUntil, accountStatus, failedLoginFrequency, rid) VALUES (uid, nric, name, email, contact_no, gender, date_of_birth, address, zipcode, NULL, 1, 0, rid);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE assign_token_to_user
(userid INT, tokenid MACADDR)
AS $$
BEGIN
  UPDATE Users SET tid = tokenid WHERE uid = userid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_user_info
(uid INTEGER, nric CHAR(9), name VARCHAR(255), email VARCHAR(255), contact_no INTEGER, gender VARCHAR(6), date_of_birth DATE, address VARCHAR(255), zipcode INTEGER, quarantineUntil DATE, accountStatus INT, failedLoginFrequency INT, rid INTEGER)
AS $$
BEGIN
  UPDATE Users SET nric = nric, name = name, email = email, contact_no = contact_no, gender = gender, date_of_birth = date_of_birth, address = address, zipcode = zipcode, accountStatus = accountStatus, failedLoginFrequency = failedLoginFrequency, quarantineUntil = quarantineUntil, rid = rid WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_user_contact
(uid INTEGER, email VARCHAR(255), contact_no INTEGER)
AS $$
BEGIN
  UPDATE Users SET email = email, contact_no = contact_no WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_user_address
(uid INTEGER, address VARCHAR(255), zipcode INTEGER)
AS $$
BEGIN
  UPDATE Users SET address = address, zipcode = zipcode WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_accountStatus 
(uid INTEGER, newStatus INTEGER)
AS $$
BEGIN
  UPDATE Users SET accountStatus = newStatus WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_failedLoginFrequency
(uid INTEGER, frequency INTEGER)
AS $$
BEGIN
  UPDATE Users SET failedLoginFrequency = frequency WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_role
(uid INTEGER, newRole INTEGER)
AS $$
BEGIN
  UPDATE Users SET rid = newRole WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_quarantineTime
(uid INTEGER, quarantineUntil DATE)
AS $$
BEGIN
  UPDATE Users SET quarantineUntil = quarantineUntil WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_medical_history
(uid INTEGER, vaccination_history VARCHAR(255), recent_test_result VARCHAR(255))
AS $$
BEGIN
  INSERT INTO MedicalHistories (uid, vaccination_history, recent_test_result) VALUES (uid, vaccination_history, recent_test_result);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_vaccination_history
(uid INTEGER, vaccination_history VARCHAR(255))
AS $$
BEGIN
  UPDATE MedicalHistories SET vaccination_history = vaccination_history WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_recent_test_result
(uid INT, recent_test_result VARCHAR(255))
AS $$
BEGIN
  UPDATE MedicalHistories SET recent_test_result = recent_test_result WHERE uid = uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_credential
(uname VARCHAR(255), hash VARCHAR(255))
AS $$
DECLARE
userid INT;
BEGIN
  SELECT (MAX(uid) + 1) INTO userid FROM Users;
  INSERT INTO Credentials (uid, username, password_hash) VALUES (userid, uname, hash);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE edit_password_hash
(uname INT, new_hash VARCHAR(255))
AS $$
BEGIN
  UPDATE Credentials SET password_hash = new_hash WHERE username = uname;
END;
$$ LANGUAGE plpgsql;


--Triggers for input constraint
DROP TRIGGER IF EXISTS check_gender ON Users CASCADE;
DROP TRIGGER IF EXISTS check_test_result ON MedicalHistories CASCADE;

DROP FUNCTION IF EXISTS check_gender() CASCADE;
DROP FUNCTION IF EXISTS check_test_result() CASCADE;

--Trigger for gender input checking on Users
CREATE OR REPLACE FUNCTION check_gender() 
RETURNS TRIGGER AS $$
DECLARE
gender VARCHAR(6) := NEW.gender;
valid INT := 0;
BEGIN
  IF (UPPER(gender) = 'FEMALE') THEN valid = 1;
  ELSIF (UPPER(gender) = 'MALE') THEN valid = 1;
  ELSE RAISE EXCEPTION 'Gender should be either Male or Female.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_gender
BEFORE INSERT OR UPDATE ON Users
FOR EACH ROW EXECUTE FUNCTION check_gender();


--Procedures for retrieving data
--Procedures for admin
DROP FUNCTION IF EXISTS get_all_user_data_admin(integer);
DROP FUNCTION IF EXISTS get_all_role_data_admin(integer);
DROP FUNCTION IF EXISTS get_all_permission_data_admin(integer);
DROP FUNCTION IF EXISTS get_all_rolepermission_data_admin(integer);
DROP FUNCTION IF EXISTS get_all_token_data_admin(integer);
DROP FUNCTION IF EXISTS get_all_credential_data_admin(integer);
DROP FUNCTION IF EXISTS get_all_medical_history_data_admin(integer);
DROP FUNCTION IF EXISTS get_one_user_data_admin(integer);

CREATE OR REPLACE FUNCTION get_all_user_data_admin (userId INT)
RETURNS SETOF Users AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 0) THEN RAISE EXCEPTION 'Only admin can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Users);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_role_data_admin (userId INT)
RETURNS SETOF Roles AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 0) THEN RAISE EXCEPTION 'Only admin can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Roles);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_permission_data_admin (userId INT)
RETURNS SETOF Permissions AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 0) THEN RAISE EXCEPTION 'Only admin can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Permissions);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_rolepermission_data_admin (userId INT)
RETURNS SETOF RolePermissions AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 0) THEN RAISE EXCEPTION 'Only admin can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM RolePermissions);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_token_data_admin (userId INT)
RETURNS SETOF Tokens AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 0) THEN RAISE EXCEPTION 'Only admin can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Tokens);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_credential_data_admin (userId INT)
RETURNS SETOF Credentials AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 0) THEN RAISE EXCEPTION 'Only admin can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Credentials);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_medical_history_data_admin (userId INT)
RETURNS SETOF MedicalHistories AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 0) THEN RAISE EXCEPTION 'Only admin can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM MedicalHistories);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_one_user_data_admin (userId INT)
RETURNS SETOF Users AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 0) THEN RAISE EXCEPTION 'Only admin can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Users WHERE uid = userID);
  END IF;
END;
$$ LANGUAGE plpgsql;


--Procedures for public users
DROP FUNCTION IF EXISTS get_one_user_data_public(integer);

CREATE OR REPLACE FUNCTION get_one_user_data_public (userId INT)
RETURNS SETOF Users AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 3) THEN RAISE EXCEPTION 'Only registered public user can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Users WHERE uid = userID);
  END IF;
END;
$$ LANGUAGE plpgsql;


--Procedures for contact tracers
DROP FUNCTION IF EXISTS get_all_user_data_tracer(userId INT);
DROP FUNCTION IF EXISTS get_one_user_data_tracer(integer);

CREATE OR REPLACE FUNCTION get_all_user_data_tracer(userId INT)
RETURNS Table(token_id MACADDR, user_id INT, user_name VARCHAR(255), user_email VARCHAR(255), user_contact_no INT) AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 2) THEN RAISE EXCEPTION 'Only contact tracer can use this procedure.';
  ELSE RETURN QUERY (SELECT tid, uid, name, email, contact_no FROM Users);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_one_user_data_tracer (userId INT)
RETURNS SETOF Users AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 2) THEN RAISE EXCEPTION 'Only contact tracer can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Users WHERE uid = userID);
  END IF;
END;
$$ LANGUAGE plpgsql;


--Procedures for health authorities
DROP FUNCTION IF EXISTS get_health_data_authority(integer);
DROP FUNCTION IF EXISTS get_one_user_data_authority(integer);

CREATE OR REPLACE FUNCTION get_health_data_authority (userId INT)
RETURNS SETOF MedicalHistories AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 1) THEN RAISE EXCEPTION 'Only health authorities can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM MedicalHistories);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_one_user_data_authority (userId INT)
RETURNS SETOF Users AS $$
DECLARE
  role INT;
BEGIN
  SELECT rid INTO role FROM Users WHERE uid = userID;
  IF (role != 1) THEN RAISE EXCEPTION 'Only health authorities can use this procedure.';
  ELSE RETURN QUERY (SELECT * FROM Users WHERE uid = userID);
  END IF;
END;
$$ LANGUAGE plpgsql;

--Procedures for researchers
DROP FUNCTION IF EXISTS get_all_user_data_researcher();
DROP FUNCTION IF EXISTS get_all_health_data_researcher();

CREATE OR REPLACE FUNCTION get_all_user_data_researcher()
RETURNS Table(id INT, user_gender VARCHAR(6), year_of_birth text, postal_code INT) AS $$
BEGIN
  RETURN QUERY (SELECT uid, gender, to_char(date_of_birth, 'YYYY'), zipcode FROM Users);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_health_data_researcher()
RETURNS Table(id INT, vaccination VARCHAR(255)) AS $$
BEGIN
  RETURN QUERY (SELECT uid, vaccination_history FROM MedicalHistories);
END;
$$ LANGUAGE plpgsql;