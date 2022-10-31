--Schema tests
CREATE OR REPLACE FUNCTION public.testschema()
RETURNS SETOF TEXT LANGUAGE plpgsql AS $$
BEGIN
  RETURN NEXT has_table('roles');
  RETURN NEXT has_table('tokens');
  RETURN NEXT has_table('credentials');
  RETURN NEXT has_table('users');
  RETURN NEXT has_table('permissions');
  RETURN NEXT has_table('rolepermissions');
  RETURN NEXT has_table('medicalhistories');
END;
$$;

SELECT * FROM runtests('public'::name);

--Function tests
BEGIN;
SELECT plan(17);

SELECT has_function(
    'get_all_user_data_admin',
    ARRAY ['integer'],
    'get_all_user_data_admin exists'
);

SELECT has_function(
    'get_all_role_data_admin',
    ARRAY ['integer'],
    'get_all_role_data_admin exists'
);

SELECT has_function(
    'get_all_rolepermission_data_admin',
    ARRAY ['integer'],
    'get_all_rolepermission_data_admin exists'
);

SELECT has_function(
    'get_all_permission_data_admin',
    ARRAY ['integer'],
    'get_all_permission_data_admin exists'
);

SELECT has_function(
    'get_all_token_data_admin',
    ARRAY ['integer'],
    'get_all_token_data_admin exists'
);

SELECT has_function(
    'get_all_credential_data_admin',
    ARRAY ['integer'],
    'get_all_credential_data_admin exists'
);

SELECT has_function(
    'get_all_medical_history_data_admin',
    ARRAY ['integer'],
    'get_all_medical_history_data_admin exists'
);

SELECT has_function(
    'get_one_user_data_admin',
    ARRAY ['integer'],
    'get_one_user_data_admin exists'
);

SELECT has_function(
    'get_one_user_data_public',
    ARRAY ['integer'],
    'get_one_user_data_public exists'
);

SELECT has_function(
    'get_all_user_data_tracer',
    ARRAY ['integer'],
    'get_all_user_data_tracer exists'
);

SELECT has_function(
    'get_one_user_data_tracer',
    ARRAY ['integer'],
    'get_one_user_data_tracer exists'
);

SELECT has_function(
    'get_health_data_authority',
    ARRAY ['integer'],
    'get_health_data_authority exists'
);

SELECT has_function(
    'get_one_user_data_authority',
    ARRAY ['integer'],
    'get_one_user_data_authority exists'
);

SELECT has_function(
    'get_all_user_data_researcher',
    'get_all_user_data_researcher exists'
);

SELECT has_function(
    'get_all_health_data_researcher',
    'get_all_health_data_researcher exists'
);

SELECT throws_ok(
    'select get_all_user_data_tracer(1::integer)',
    'Only contact tracer can use this procedure.',
    'Throws role permission not granted exception'
);

SELECT throws_ok(
    'select get_health_data_authority(4::integer)',
    'Only health authorities can use this procedure.',
    'Throws role permission not granted exception'
);

SELECT *
FROM finish();
ROLLBACK;