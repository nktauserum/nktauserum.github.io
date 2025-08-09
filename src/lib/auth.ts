export async function validate(): Promise<boolean> {
    try {
      const res = await fetch("http://localhost:8080/auth/validate", {
        method: "POST",
        credentials: "include",
      });

      return res.ok;
    } catch (e: any) {
      console.error("Error validating token: " + e);
      return false;
    }
  }
