"use client";

import { useRef, useState, type FormEvent } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

type TeachingAssignment = {
  syllabus: string;
  subject: string;
};

export type AddStudentData = {
  name: string;
  email: string;
  level: string;
  assignments: TeachingAssignment[];
};

type AddStudentProps = {
  onCancel: () => void;
  onSave?: (data: AddStudentData) => Promise<void> | void;
};

type AssignmentRow = TeachingAssignment & {
  id: number;
};

type FormErrors = {
  name?: string;
  email?: string;
  level?: string;
  assignments?: Record<number, string>;
  submit?: string;
};

const fields = [
  {
    key: "syllabus",
    label: "Syllabus",
    placeholder: "e.g. HKDSE, IB, Other",
  },
  {
    key: "subject",
    label: "Subject",
    placeholder: "e.g. Mathematics",
  },
] as const;

function validateAssignment(row: TeachingAssignment) {
  const missing: string[] = [];

  if (!row.syllabus.trim()) missing.push("syllabus");
  if (!row.subject.trim()) missing.push("subject");

  return missing.length > 0
    ? `Please enter ${missing.join(" and ")}.`
    : "";
}

function inputClass(hasError: boolean) {
  return [
    "h-11 w-full min-w-0 rounded-xl border bg-white px-3",
    "text-sm text-zinc-900 outline-none transition-colors",
    "placeholder:text-zinc-400 disabled:bg-zinc-50",
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-zinc-200 focus:border-zinc-500",
  ].join(" ");
}

export default function AddStudentForm({
  onCancel,
  onSave,
}: AddStudentProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("");

  const [rows, setRows] = useState<AssignmentRow[]>([
    { id: 0, syllabus: "", subject: "" },
  ]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextRowId = useRef(1);
  const submittingRef = useRef(false);

  function addRow() {
    if (rows.length >= 50) return;

    const id = nextRowId.current++;

    setRows((previous) => [
      ...previous,
      { id, syllabus: "", subject: "" },
    ]);

    setErrors((previous) => ({
      ...previous,
      submit: undefined,
    }));
  }

  function removeRow(id: number) {
    if (rows.length <= 1) return;

    setRows((previous) =>
      previous.filter((row) => row.id !== id),
    );

    setErrors((previous) => {
      const assignments = { ...previous.assignments };
      delete assignments[id];

      return {
        ...previous,
        assignments,
        submit: undefined,
      };
    });
  }

  function updateRow(
    id: number,
    field: keyof TeachingAssignment,
    value: string,
  ) {
    const currentRow = rows.find((row) => row.id === id);
    if (!currentRow) return;

    const updatedRow = { ...currentRow, [field]: value };

    setRows((previous) =>
      previous.map((row) =>
        row.id === id ? updatedRow : row,
      ),
    );

    setErrors((previous) => ({
      ...previous,
      submit: undefined,
      assignments: previous.assignments?.[id]
        ? {
            ...previous.assignments,
            [id]: validateAssignment(updatedRow),
          }
        : previous.assignments,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;

    const form = event.currentTarget;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedLevel = level.trim();

    const newErrors: FormErrors = {};
    const assignmentErrors: Record<number, string> = {};

    if (!trimmedName) {
      newErrors.name = "Please enter the student's name.";
    }

    const emailInput = form.elements.namedItem(
      "email",
    ) as HTMLInputElement | null;

    if (!trimmedEmail) {
      newErrors.email = "Please enter the student's email.";
    } else if (
      emailInput?.validity.typeMismatch ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!trimmedLevel) {
      newErrors.level = "Please enter the student's school level / year.";
    }

    rows.forEach((row) => {
      const message = validateAssignment(row);

      if (message) {
        assignmentErrors[row.id] = message;
      }
    });

    if (Object.keys(assignmentErrors).length > 0) {
      newErrors.assignments = assignmentErrors;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstInvalidName = newErrors.name
        ? "name"
        : newErrors.email
          ? "email"
          : newErrors.level
            ? "level"
            : (() => {
                const row = rows.find(
                  (item) => assignmentErrors[item.id],
                );

                const field = row
                  ? fields.find((item) => !row[item.key].trim())
                  : undefined;

                return row && field
                  ? `assignment-${row.id}-${field.key}`
                  : "";
              })();

      const input = form.elements.namedItem(firstInvalidName);

      if (input instanceof HTMLInputElement) {
        input.focus();
      }

      return;
    }

    const data: AddStudentData = {
      name: trimmedName,
      email: trimmedEmail,
      level: trimmedLevel,
      assignments: rows.map((row) => ({
        syllabus: row.syllabus.trim(),
        subject: row.subject.trim(),
      })),
    };

    if (!onSave) {
      setErrors({
        submit: "Saving is not connected yet. Your entries have been kept.",
      });
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onSave(data);
      onCancel();
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Could not add the student. Please try again.",
      });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="w-full space-y-6 bg-white p-6"
    >
      <fieldset disabled={isSubmitting} className="min-w-0 space-y-6">
        {/* Details shared by all subjects */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="student-name"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Student name
            </label>

            <input
              id="student-name"
              name="name"
              type="text"
              autoComplete="off"
              required
              maxLength={100}
              value={name}
              placeholder="Chris Wong"
              onChange={(event) => {
                setName(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  name: undefined,
                  submit: undefined,
                }));
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "student-name-error" : undefined
              }
              className={inputClass(Boolean(errors.name))}
            />

            {errors.name && (
              <p
                id="student-name-error"
                className="mt-1.5 text-xs text-red-500"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="student-email"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>

            <input
              id="student-email"
              name="email"
              type="email"
              autoComplete="off"
              required
              maxLength={254}
              value={email}
              placeholder="student@example.com"
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  email: undefined,
                  submit: undefined,
                }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "student-email-error" : undefined
              }
              className={inputClass(Boolean(errors.email))}
            />

            {errors.email && (
              <p
                id="student-email-error"
                className="mt-1.5 text-xs text-red-500"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="student-level"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              School level / year
            </label>

            <input
              id="student-level"
              name="level"
              type="text"
              required
              maxLength={100}
              value={level}
              placeholder="P2, F5, Year 10, DP 1"
              onChange={(event) => {
                setLevel(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  level: undefined,
                  submit: undefined,
                }));
              }}
              aria-invalid={Boolean(errors.level)}
              aria-describedby={
                errors.level ? "student-level-error" : undefined
              }
              className={inputClass(Boolean(errors.level))}
            />

            {errors.level && (
              <p
                id="student-level-error"
                className="mt-1.5 text-xs text-red-500"
              >
                {errors.level}
              </p>
            )}
          </div>
        </div>

        {/* Multiple subjects for one student */}
        <div className="border-t border-zinc-100 pt-5">
          <h3 className="text-sm font-medium text-zinc-900">
            Subjects you teach
          </h3>

          <div className="mt-4 space-y-4">
            {rows.map((row, index) => {
              const rowError = errors.assignments?.[row.id];
              const errorId = `assignment-error-${row.id}`;

              return (
                <fieldset
                  key={row.id}
                  className="min-w-0 rounded-2xl border border-zinc-200 p-4"
                >
                  <legend className="sr-only">
                    Subject {index + 1}
                  </legend>

                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">
                      Subject {index + 1}
                    </span>

                    {rows.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Remove subject ${index + 1}`}
                        onClick={() => removeRow(row.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <TrashIcon
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {fields.map(({ key, label, placeholder }) => {
                      const inputId = `assignment-${row.id}-${key}`;
                      const invalid = Boolean(
                        rowError && !row[key].trim(),
                      );

                      return (
                        <div key={key} className="min-w-0">
                          <label
                            htmlFor={inputId}
                            className="mb-1.5 block text-xs text-zinc-600"
                          >
                            {label}
                          </label>

                          <input
                            id={inputId}
                            name={inputId}
                            type="text"
                            required
                            maxLength={100}
                            value={row[key]}
                            placeholder={placeholder}
                            onChange={(event) =>
                              updateRow(row.id, key, event.target.value)
                            }
                            aria-invalid={invalid}
                            aria-describedby={
                              invalid ? errorId : undefined
                            }
                            className={inputClass(invalid)}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {rowError && (
                    <p
                      id={errorId}
                      className="mt-2 text-xs text-red-500"
                    >
                      {rowError}
                    </p>
                  )}
                </fieldset>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= 50}
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusIcon aria-hidden="true" className="h-4 w-4" />
            Add another subject
          </button>
        </div>
      </fieldset>

      {errors.submit && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {errors.submit}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add student"}
        </button>
      </div>
    </form>
  );
}