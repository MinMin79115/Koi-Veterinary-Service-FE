import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../config/firebase"

const uploadFile = async (file) => {
    //lưu file này lên firebase
    const storageRef = ref(storage, file.name)
    const respone = await uploadBytes(storageRef,file)
    // => lấy cái đường dẫn đến file vừa tạo
    const downloadURL = await getDownloadURL(respone.ref)
    return downloadURL
}

export default uploadFile;