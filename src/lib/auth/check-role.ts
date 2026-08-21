import { createClient }
from "@/lib/supabase/server";


export async function checkRole(
role:string
){

const supabase =
await createClient();


const {
data
}=await supabase
.from("user_roles")
.select("*")
.eq(
"user_id",
(await supabase.auth.getUser())
.data.user?.id
)
.eq(
"role",
role
)
.single();



return !!data;

}