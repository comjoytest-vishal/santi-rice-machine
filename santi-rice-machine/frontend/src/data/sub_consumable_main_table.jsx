import React, { useEffect, useState } from "react";

const SubConsumableMainTable = () => {

const [data,setData] = useState([])
const [editRow,setEditRow] = useState(null)

const API = "http://localhost/santi-rice-machine/backend/get_sub_consumable_main.php"


/* FETCH DATA */

const fetchData = async () =>{

try{

const res = await fetch(API)
const json = await res.json()

if(json.success){
setData(json.data)
}

}catch(err){
console.log("Fetch error:",err)
}

}

useEffect(()=>{
fetchData()
},[])



/* HANDLE EDIT */

const handleChange = (e,id)=>{

const {name,value} = e.target

setData(prev =>
prev.map(row =>
row.id === id ? {...row,[name]:value} : row
)
)

}



/* SAVE EDIT */

const saveEdit = async (row)=>{

try{

const res = await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(row)
})

const json = await res.json()

if(json.success){
alert("Updated Successfully")
setEditRow(null)
fetchData()
}

}catch(err){
console.log(err)
}

}



return (

<div>

<h2>Sub Consumable Main Table</h2>

<table border="1" cellPadding="8">

<thead>

<tr>
<th>ID</th>
<th>Machine Code</th>
<th>Description</th>
<th>Parent</th>
<th>Sub</th>
<th>Date</th>
<th>Opening</th>
<th>Purchase</th>
<th>Use</th>
<th>Dealer</th>
<th>Staff</th>
<th>Closing</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{data.map(row=>(

<tr key={row.id}>

<td>{row.id}</td>

<td>
<input
name="machine_code"
value={row.machine_code || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="machine_description"
value={row.machine_description || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="parent_name"
value={row.parent_name || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="sub_name"
value={row.sub_name || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
type="date"
name="date"
value={row.date || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="opening"
value={row.opening || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="purchase"
value={row.purchase || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="use_enter"
value={row.use_enter || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="dealer"
value={row.dealer || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="staff"
value={row.staff || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>
<input
name="closing_entry"
value={row.closing_entry || ""}
disabled={editRow!==row.id}
onChange={(e)=>handleChange(e,row.id)}
/>
</td>

<td>

{editRow === row.id ? (

<button onClick={()=>saveEdit(row)}>Save</button>

) : (

<button onClick={()=>setEditRow(row.id)}>Edit</button>

)}

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}

export default SubConsumableMainTable