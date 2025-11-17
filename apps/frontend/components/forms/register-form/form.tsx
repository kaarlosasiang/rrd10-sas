import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import Image from "next/image";

export function SignupForm({
                                  className,
                                  ...props
                              }: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex items-center justify-center rounded-md">
                                <Image src={"/rrd10_logo.png"} alt={"RRD10 Logo"} width={150} height={150} />
                            </div>
                            <span className="sr-only">RRD10 SAS</span>
                        </a>
                        <h1 className="text-xl font-bold">Create your account</h1>
                        <FieldDescription>
                            Already have an account? <a href="#">Sign in</a>
                        </FieldDescription>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="name">Full Name</FieldLabel>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                        />
                    </Field>
                    <Field>
                        <Button type="submit" className={"font-bold"}>Sign Up</Button>
                    </Field>
                </FieldGroup>
            </form>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}

