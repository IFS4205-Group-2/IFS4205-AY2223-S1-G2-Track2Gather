--Schema tests
CREATE OR REPLACE FUNCTION public.testschema()
RETURNS SETOF TEXT LANGUAGE plpgsql AS $$
BEGIN
  RETURN NEXT has_table('tokens');
  RETURN NEXT has_table('tracingrecords');
END;
$$;

SELECT * FROM runtests('public'::name);

--Function tests
BEGIN;
SELECT plan(4);

SELECT has_function(
    'add_token',
    ARRAY ['macaddr', 'date'],
    'add_token exists'
);

SELECT has_function(
    'deactivate_token',
    ARRAY ['macaddr'],
    'deactivate_token exists'
);

SELECT has_function(
    'get_all_token_data',
    'get_all_token_data exists'
);

SELECT has_function(
    'get_all_tracing_data',
    'get_all_tracing_data exists'
);

SELECT *
FROM finish();
ROLLBACK;