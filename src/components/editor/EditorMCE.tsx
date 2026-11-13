/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Editor } from "@tinymce/tinymce-react";
import { API_URL } from "@/config/variable";

export const EditorMCE = ({
  editorRef,
  value = "",
  id = "",
}: {
  editorRef: any;
  value?: string;
  id?: string;
}) => (
  <Editor
    apiKey={process.env.NEXT_PUBLIC_API_TINYMCE}
    onInit={(_event, editor) => {
      editorRef.current = editor;
    }}
    initialValue={value}
    id={id}
    init={{
      height: 420,
      menubar: false,
      plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
      ],
      toolbar:
        "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table | removeformat",
      content_style:
        "body{font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.7;color:#0f172a;padding:8px}",
      branding: false,
      promotion: false,
      resize: true,
      /* API_URL carries a fallback, so an unset env var cannot turn this into
         "undefined/upload/image" — which is what a bare
         `${process.env.NEXT_PUBLIC_API_URL}` produced. */
      images_upload_url: `${API_URL}/upload/image`,
    }}
  />
);
