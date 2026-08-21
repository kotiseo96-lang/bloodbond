"use server";


import { createClient }
from "@/lib/supabase/server";


export async function getDonors(
filters:any
){


const supabase =
await createClient();



let query =
supabase
.from("donors")
.select("*");



if(filters.blood_group){

query=query.eq(
"blood_group",
filters.blood_group
)

}



if(filters.city_id){

query=query.eq(
"city_id",
filters.city_id
)

}



if(filters.area_id){

query=query.eq(
"area_id",
filters.area_id
)

}



return query;

}