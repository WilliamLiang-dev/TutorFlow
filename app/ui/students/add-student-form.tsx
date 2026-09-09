"use-client"

import { useState } from "react";

type AddStudentProps ={
    onCancel: () => void
}

export default function AddStudentForm({
    onCancel,
} : AddStudentProps) {
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        academicDetails?: string;
    }>({});

    const [rows, setRows] = useState([
      {syllabus: "", subject: "", level: ""}
    ]);

    const syllabusOptions = {
    HKDSE: {
      subjects: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "Chinese",
        "Economics",
        "Geography",
        "History",
        "ICT",
      ],
      levels: [
        "P1",
        "P2",
        "P3",
        "P4",
        "P5",
        "P6",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
      ],
      levelLabel: "Level",
    },

    IGCSE: {
      subjects: [
        "Mathematics",
        "Additional Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "Chinese",
        "Economics",
        "Business",
        "Computer Science",
        "Geography",
        "History",
      ],
      levels: [
        "Year 9",
        "Year 10",
        "Year 11",
      ],
      levelLabel: "Year",
    },

    IB: {
      subjects: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "Chinese",
        "Economics",
        "Business Management",
        "Computer Science",
        "Geography",
        "History",
      ],
      levels: [
        "PYP",
        "MYP 1",
        "MYP 2",
        "MYP 3",
        "MYP 4",
        "MYP 5",
        "DP 1",
        "DP 2",
      ],
      levelLabel: "Level",
    },
  };

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const syllabus= String(formData.get("syllabus") ?? "").trim();
        const subject= String(formData.get("subject") ?? "").trim();
        const level = String(formData.get("level") ?? "").trim();

        const newErrors: {
            name?: string;
            email?: string;
            academicDetails?: string;
        } = {};

        function joinWithAnd(items: string[]) {
          if (items.length === 1) {
            return items[0];
          }

          return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
        }
        const missingFields: string[] = [];

        if (!name) {
            newErrors.name = "Please enter the student's name"
        }
        if (!email) {
            newErrors.email = "Please enter the student's email"
        }
        if (!syllabus) {
            missingFields.push("syllabus")
        }
        if (!subject) {
            missingFields.push("subject")
        }
        if (!level) {
            missingFields.push("level")
        }

        if (missingFields.length > 0) {
          newErrors.academicDetails = `Please select ${joinWithAnd(missingFields)}`
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
    }
    function updateRow(
      index: number,
      field: "syllabus" | "subject" | "level",
      value: string
    ) {
      setRows(previousRows =>
        previousRows.map((row, rowIndex) => {
          if (rowIndex !== index) return row;

          if (field === "syllabus") {
            return { ...row, syllabus: value, subject: "", level: "" }
          }

          return {...row, [field]: value}
        }
        )
      )

    }
    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className={`w-full space-y-4 rounded-md bg-white p-6 
              transition-[max-width] ease-in-out duration-300 ${
              rows.length > 1 ? "max-w-[31rem]" : "max-w-md"
            }`}>
            <div>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="name"
                  placeholder=" "
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onChange={(event) => {
                    if (event.target.value.trim()) {
                      setErrors((previousErrors) => ({
                        ...previousErrors,
                        name: undefined,
                      }));
                    }
                  }}
                  className="peer h-14 w-full rounded
                  border border-zinc-500
                  bg-transparent
                  px-3 text-black
                  outline-none"
                />
                <label
                  className="
                    absolute left-3 top-0
                    -translate-y-1/2 scale-75
                    bg-white/100 px-2
                    bg-transparent text-sm text-zinc-500
                    transition-all duration-200

                    peer-placeholder-shown:top-1/2
                    peer-placeholder-shown:scale-100

                    peer-focus:top-0
                    peer-focus:scale-75
                    "
                >
                  Name
                </label>
              </div>
              <div
                className={`
                grid transition-[grid-template-rows]
                duration-200 ease-out
                ${errors.name ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
              `}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="text-xs text-red-500">
                    {errors.name}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  aria-invalid={Boolean(errors.email)}
                  aria-errormessage={errors.email ? "email error" : undefined}
                  onChange={(event) => {
                    if (event.target.value.trim()) {
                      setErrors((previousErrors) => ({
                        ...previousErrors,
                        email: undefined,
                      }));
                    }
                  }}
                  className="
                  peer h-14 w-full rounded
                  border border-zinc-500
                  bg-transparent
                  px-3
                  text-black
                  outline-none
                "
                />

                <label
                  className="
                  absolute left-3 top-0
                  -translate-y-1/2 scale-75
                  bg-white/100 px-2
                  bg-transparent text-sm text-zinc-500
                  transition-all duration-200

                  peer-placeholder-shown:top-1/2
                  peer-placeholder-shown:scale-100

                  peer-focus:top-0
                  peer-focus:scale-75
                "
                >
                  Email
                </label>
              </div>
            <div
              className={`
              grid transition-[grid-template-rows]
              duration-200 ease-out
              ${errors.email ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
            `}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="text-xs text-red-500">
                  {errors.email}
                </p>
              </div>
            </div>
            </div>
            {rows.map((row, index) => (
              <div key={index}>
                <div
                  className={`grid gap-4 ${
                    rows.length > 1
                      ? "grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_1rem]"
                      : "grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]"
                  }`}
                >
                <div className="flex flex-col text-sm">
                  <label className="pb-1">
                    Syllabus:
                  </label>
                  <select
                    id="syllabus"
                    name="syllabus"
                    value={row.syllabus}
                    onChange={(event) => updateRow(index, "syllabus", event.target.value)}
                    className="focus:outline-none rounded border border-zinc-500 px-1 py-2 min-w-0"
                  >
                    <option value=""></option>
                    {Object.keys(syllabusOptions).map((syllabusOptions) =>
                      <option
                        key={syllabusOptions}
                        value={syllabusOptions}>
                        {syllabusOptions}
                      </option>)}
                  </select>
                </div>
                <div className="flex flex-1 flex-col text-sm">
                  <label className="pb-1">
                    Subject:
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="focus:outline-none rounded border border-zinc-500 px-1 py-2 min-w-0">
                    <option value=""></option>
                    {row.syllabus && (
                      syllabusOptions[
                        row.syllabus as keyof typeof syllabusOptions
                      ].subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="flex flex-1 flex-col text-sm">
                  <label className="pb-1">
                    Level:
                  </label>
                  <select
                    id="level"
                    name="level"
                    className="focus:outline-none rounded border border-zinc-500 px-1 py-2 min-w-0">
                    <option value=""></option>
                    {row.syllabus && (
                      syllabusOptions[
                        row.syllabus as keyof typeof syllabusOptions
                      ].levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {rows.length > 1 && (
                  <div className="flex h-10 items-center justify-center self-end">
                    {index >= 1 && (
                      <button
                      type="button"
                      className="flex items-center justify-center rounded-full h-4 w-4 bg-[#ed2027] cursor-pointer"
                      onClick={() => {
                        setRows(previousRows =>
                          previousRows.filter((_, rowIndex) => rowIndex !== index)
                        )
                      }}>
                      <span className="text-white -translate-y-[1px]">
                        -
                      </span>
                    </button>
                    )}
                    </div>
                )}
                </div>
              </div>
            ))}
            <div
              className={`
                grid transition-[grid-template-rows] duration-200
                ${errors.academicDetails ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
              `}
              >
                <div className="min-h-0 overflow-hidden">
                  <p
                    id="academicDetails"
                    className="text-xs text-red-500">
                    {errors.academicDetails}
                  </p>
                </div>
            </div>

            <div className="pt-1">
              <button 
              className="flex items-center justify-center cursor-pointer inline-flex gap-3 rounded-full bg-[#0d9647] h-6 w-6"
              type="button"
              onClick={() => {
                setRows(previousRows => [
                  ... previousRows,
                  {syllabus:"", subject:"", level:""},
                ])
              }}>
              <span className="text-white -translate-y-[1px]">+</span>
              </button>
            </div>
            <div className="flex justify-end gap-5">
              <button
                type="submit"
                className="bg-black rounded-xl text-white px-3 py-1 text-lg border border-black hover:bg-transparent transitions-color hover:text-black ease-in-out">
                Send
              </button>
              <button
                type="button"
                className="cursor-pointer"
                onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
    )

}