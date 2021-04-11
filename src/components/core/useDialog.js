
import {useState} from "react"

function useDialog() {

    const [openDialog, setOpenDialog] = useState(false)

    const closeDialog = (action) => {
        setOpenDialog(false)
    }
}