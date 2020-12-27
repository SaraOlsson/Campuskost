
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash"

// custom hook, input list with drag-n-drop
function useInstructions({
    initInstructions, 
    // handleAdd, 
    propertyName, 
    customFieldsDefault,
    HEADER,
    DEFAULT
}) {

  const [editObject, setEditObject] = useState(undefined);
  const [customFieldsData, setCustomFieldsData] = useState(customFieldsDefault)

  const [instructions, setInstructions] = useState([]) //useState(() => initiate_instructions()); // FIX

  const dispatch = useDispatch(); 
  const upload_store = useSelector(state => state.uploadReducer);

  const instructionsDisp = (instructions) => {
    dispatch({
        type: "SETDATA",
        payload: {[propertyName]: instructions}
    })
  }

    //   function initiate_instructions() {
    //       console.log(initInstructions)
    //     return (initInstructions !== undefined) ? initInstructions : [];
    //   }

  useEffect(() => {

    const existing_instructions = upload_store.data[propertyName] 
    if(existing_instructions !== undefined)
    {
      console.log("has existing_instructions")
      setInstructions(existing_instructions);
    }

  }, []);

  useEffect(() => {
    if(!upload_store.editmode)
    {
      emptyLocalState()
      console.log("empty local state")
    }
  }, [upload_store.editmode]);

  const emptyLocalState = () => {
    setInstructions([])
  }

  const onReorder = (reordered_rows) => {


    const updated_instruction = reordered_rows.map((row, idx) => {
        let item = find_instruction(row.id)
        // console.log(item)
        if(item)
        {
            return {
                ...item,
                order: idx,
                type: item.type || DEFAULT // REALLY? all recipes don't have type yet
            }
        } else
            console.log("row id " + row.id + " not found")
        
    })

    // BOTH?
    setInstructions(updated_instruction)
    instructionsDisp(updated_instruction)
 
  }
  
  const find_instruction = (idx) => {
    return instructions.find( d => d.order.toString() === idx);
  }

  const max_order = () => {
    let max = 0;
    instructions.forEach(d => {
      if(d.order > max)
      {
        max = d.order;
      }
    })
    return max;
  }


  const addInstruction = (row_type) => {

    let temp_list = instructions.slice(0);
    let new_order = (max_order()+1).toString();
    let new_obj = {order: new_order, type: row_type, ...customFieldsDefault}; 
    temp_list.push(new_obj);
    setEditObject(new_obj);

    // BOTH?
    setInstructions(temp_list);
    instructionsDisp(temp_list);
  }

  const removeInstruction = () => {

    let temp_list = instructions.slice(0);
    let ind = temp_list.indexOf(editObject);
    temp_list.splice(ind, 1);

    setEditObject(undefined);
    //setText(""); // FIX
    setCustomFieldsData(customFieldsDefault)

    // BOTH?
    setInstructions(temp_list);
    instructionsDisp(temp_list);

  }

  const listClick = (object) => {
    setEditObject(object);
    setCustomFieldsData({...object})
  }

  const saveEdited = () => {

    let temp_list = _.clone(instructions);
    let ind = temp_list.indexOf(editObject);

    let obj_copy = {...editObject, ...customFieldsData};
    temp_list[ind] = obj_copy;

    // clear
    setEditObject(undefined);
    setCustomFieldsData(customFieldsDefault)

    // update
    // handleAdd(temp_list.length); // other way?
    setInstructions(temp_list); // BOTH?
    instructionsDisp(temp_list); // BOTH?

  }

  // attach id to each jsx item, for DnD
  const getMyItems = (d_data, datajsx) => {

    const data = datajsx.map((item, idx) => ({
      id: `${d_data[idx].order}`,
      content: item
    }));
    return data;
  }

  const enterPress = (ev) => {

    if (ev.key === 'Enter') {

      saveEdited();
      ev.preventDefault();
    }
  }

  // FIX
  const getOrder = (item) => {

    if (item.type === HEADER) {
      return "";
    } else {
      return '• ';
    }

  }

  return {
    instructions, 
    onReorder,
    editObject,
    saveEdited,
    addInstruction,
    removeInstruction,
    customFieldsData,
    setCustomFieldsData,
    enterPress,
    getOrder,
    getMyItems,
    listClick
  }

}

export default useInstructions