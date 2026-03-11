import React, { useEffect, useState } from "react";
import "../css/subConsumableWorkTable.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaTrash, FaBoxOpen } from "react-icons/fa";

const SubConsumableWorkTable = () => {

const [data,setData]=useState([]);
const [currentPage,setCurrentPage]=useState(1);

const [showConfirm,setShowConfirm]=useState(false);
const [deleteId,setDeleteId]=useState(null);

const rowsPerPage=5;

const API_URL="http://localhost/santi-rice-machine/backend/get_sub_consumable_work.php";

/* DATE FORMAT */

const formatDate=(dateString)=>{

const date=new Date(dateString);

return date.toLocaleDateString("en-GB",{
day:"2-digit",
month:"short",
year:"numeric"
});

};

/* FETCH */

const fetchData=async()=>{

try{

const res=await fetch(API_URL);
const result=await res.json();

if(result.success){

setData(result.data);

}

}catch(error){

console.error(error);

}

};

useEffect(()=>{
fetchData();
},[]);

/* CONFIRM DELETE */

const confirmDelete=(id)=>{

setDeleteId(id);
setShowConfirm(true);

};

/* DELETE */

const handleDelete=async()=>{

try{

const response=await fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
delete_id:deleteId
})

});

const result=await response.json();

if(result.success){

toast.success("Deleted Successfully");

fetchData();

}else{

toast.error("Delete Failed");

}

setShowConfirm(false);

}catch(error){

toast.error("Server Error");

}

};

/* PAGINATION */

const indexOfLastRow=currentPage*rowsPerPage;
const indexOfFirstRow=indexOfLastRow-rowsPerPage;

const currentRows=data.slice(indexOfFirstRow,indexOfLastRow);

const totalPages=Math.ceil(data.length/rowsPerPage);

return(

<div className="scw-container">

<ToastContainer position="top-right"/>

<div className="scw-header">

<h2>
<FaBoxOpen/> Sub Consumable Work Table
</h2>

<span className="scw-total">
Total Items : {data.length}
</span>

</div>

<table className="scw-table">

<thead>

<tr>
<th>SL NO</th>
<th>PARENT CONSUMABLE</th>
<th>SUB CONSUMABLE</th>
<th>CREATED ON</th>
<th>ACTION</th>
</tr>

</thead>

<tbody>

{currentRows.length===0 ? (

<tr>
<td colSpan="5" className="scw-no-data">
No Data Found
</td>
</tr>

):(

currentRows.map((item,index)=>(

<tr key={item.id}>

<td>{indexOfFirstRow+index+1}</td>

<td>
<span className="scw-badge">
{item.parent_name}
</span>
</td>

<td>
<span className="scw-badge-dark">
{item.sub_name}
</span>
</td>

<td>
<span className="scw-date">
{formatDate(item.created_at)}
</span>
</td>

<td>

<button
className="scw-delete-btn"
onClick={()=>confirmDelete(item.id)}
>

<FaTrash/> Delete

</button>

</td>

</tr>

))

)}

</tbody>

</table>

<div className="scw-pagination">

{Array.from({length:totalPages},(_,index)=>(

<button

key={index}

className={
currentPage===index+1
?
"scw-page-btn active"
:
"scw-page-btn"
}

onClick={()=>setCurrentPage(index+1)}

>

{index+1}

</button>

))}

</div>

{showConfirm &&(

<div className="scw-modal">

<div className="scw-modal-box">

<h3>Delete Confirmation</h3>

<p>Are you sure you want to delete this record?</p>

<div className="scw-modal-actions">

<button
className="scw-cancel-btn"
onClick={()=>setShowConfirm(false)}
>
Cancel
</button>

<button
className="scw-confirm-btn"
onClick={handleDelete}
>
Delete
</button>

</div>

</div>

</div>

)}

</div>

);

};

export default SubConsumableWorkTable;