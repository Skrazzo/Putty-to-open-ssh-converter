import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Shield, Github, Upload, AlertTriangle, Ban } from "lucide-react";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";
import CircleResize from "./components/spinner/CircleResize";
import { saveAs } from "file-saver";

const maxFileSize = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB);
const backendURL = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendURL;

interface UploadForm {
    key: File | null;
}

export default function KeyConverterPage() {
    const [loading, setLoading] = useState<boolean>(false);

    const FormScheme = z.object({
        key: z
            .instanceof(File, { message: "Please select a file" })
            .refine((file) => file.size <= maxFileSize * 1024 * 1024, {
                message: `File must be below ${maxFileSize} MB`,
            })
            .refine((file) => file.name.split(".").pop()?.toLowerCase() === "ppk", {
                message: "File must be putty format (.ppk)",
            }),
    });

    const form = useForm({
        defaultValues: {
            key: null,
        } as UploadForm,
        onSubmit({ value }) {
            uploadForm(value);
            // form.reset();
        },
        validators: {
            onChange: FormScheme,
        },
    });

    const uploadForm = (form: UploadForm): void => {
        setLoading(true);

        axios
            .post("/convert", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            })
            .then(async (res) => {
                // Create a new Blob with the correct MIME type
                const blob = new Blob([res.data], { type: "application/zip" });

                // Use saveAs with the blob and filename
                saveAs(blob, "Converted keys.zip");

                toast("Converted", {
                    duration: 60 * 1000 * 5,
                    description: "Your keys were converted and downloaded",
                    className: "success-toast",
                });
            })
            .catch((err) => {
                if (err instanceof AxiosError) {
                    toast(`${err.response?.statusText || "Network error"} - ${err.status} code`, {
                        description: err.response?.data.error || "Dev didn't give try catch error",
                        className: "error-toast",
                    });
                } else {
                    // Unknown error
                    toast("Unknown error", {
                        className: "error-toast",
                        description: "Contact developer, better luck in the console",
                    });
                    console.log(err);
                }
            })
            .finally(() => {
                // set loading as false, and reset form
                setLoading(false);
            });
    };

    // Basically use state, but for form values
    const { key } = useStore(form.store, (state) => state.values);

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <Toaster />
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">PPK to PEM Key Converter</CardTitle>
                    <CardDescription>Convert your PuTTY Private Key (PPK) files to PEM format</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Alert variant="default" className="bg-primary/5 border-primary/20">
                        <Shield className="h-4 w-4" />
                        <AlertTitle>Your privacy is important</AlertTitle>
                        <AlertDescription>
                            Conversation is happening on the server, because we need putty-gen cli application to
                            convert your keys. After keys are converted, originals are deleted from the server.
                        </AlertDescription>
                    </Alert>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                            <form.Field
                                name="key"
                                children={(field) => {
                                    const fieldErrors = field.state.meta.errors;
                                    console.log(fieldErrors);

                                    return (
                                        <>
                                            <input
                                                id={field.name}
                                                type="file"
                                                accept=".ppk"
                                                onChange={(e) =>
                                                    field.handleChange(e.target.files ? e.target.files[0] : null)
                                                }
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor={field.name}
                                                className="cursor-pointer flex flex-col items-center justify-center gap-2"
                                            >
                                                {fieldErrors.length > 0 ? (
                                                    <>
                                                        <Ban className="h-8 w-8 text-red-400" />
                                                        {fieldErrors.map((err) => (
                                                            <p className="text-red-400">{err?.message}</p>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-gray-500" />
                                                        <span className="font-medium">
                                                            {key ? key.name : "Click to select a PPK file"}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {key
                                                                ? `${(key.size / 1024).toFixed(2)} KB`
                                                                : "or drag and drop it here"}
                                                        </span>
                                                    </>
                                                )}
                                            </label>
                                        </>
                                    );
                                }}
                            />
                        </div>

                        <Button disabled={!key} className="w-full">
                            {loading && <CircleResize />}
                            {loading ? "Converting..." : "Convert to PEM"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} PPK to PEM Converter</p>
                    <a
                        href="https://github.com/Skrazzo/Putty-to-open-ssh-converter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                    >
                        <Github className="h-4 w-4" />
                        View on GitHub
                    </a>
                </CardFooter>
            </Card>
        </div>
    );
}
