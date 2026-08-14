ALTER TABLE faculty
DROP COLUMN program_id;

ALTER TABLE faculty
DROP COLUMN sort_order;

ALTER TABLE faculty
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE faculty
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE program_faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    program_id UUID NOT NULL
        REFERENCES programs(id)
        ON DELETE CASCADE,

    faculty_id UUID NOT NULL
        REFERENCES faculty(id)
        ON DELETE CASCADE,

    sort_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (program_id, faculty_id)
);