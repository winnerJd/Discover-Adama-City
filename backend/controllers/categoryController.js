import Category from '../models/category.js'
export const createCategory=async (req,res)=>{
    const {name}=req.body
    if(!name){
        return res.status(400).json({message:'please enter a name'})
        
    }
    try {
      
const categoryExists=await Category.findOne({name})
if(categoryExists){
    return res.status(400).json({message:'category already exists'})
}
const category=await Category.create({name})
        res.status(201).json(category);
    }
    
    catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}
export const getCategories=async (req,res)=>{
    try {
        const categories=await Category.find()
        return res.json(categories)
    } catch (error) {
        res.status(500).json({ message: error.message });  
    }

}
// update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body; 

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true } 
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

return res.json({ message: "Category updated successfully", category });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCategory=async (req,res)=>{
    try {
        const {id}=req.params

        const category=await Category.findById(id)
        if(!category){
            return res.status(404).json({message:"category not found"}) 
        }
        await category.deleteOne()
        return res.json({ message: "Category deleted successfully" });
    } catch (error) {
      return  res.status(500).json({message:error.message})
    }
}