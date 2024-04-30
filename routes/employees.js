const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { employeeModel, validateEmployee } = require("../models/employeeModel"); // Import the employee model
const router = express.Router();

// listen to the employees page route as set in the config file
router.get("/", async (req, res) => {
    res.json({ msg: "Employees endpoint" });
})

// Create a new employee
router.post('/create',authAdmin, async (req, res) => {
    let validBody = validateEmployee(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        const employee = new employeeModel(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read (get) all employees -with pagination
router.get("/list",authAdmin, async (req, res) => {
    let limit = Math.min(req.query.limit, 10) || 10;
    let pageNumber = parseInt(req.query.page -1) || 0;
    let sort = req.query.sort || "id"
    let reverse = req.query.reverse == "yes" ? 1 : -1
    try {
      let data = await employeeModel
        .find({})
        .limit(limit)
        .skip(pageNumber * limit)
        .sort({ [sort]: reverse })
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err })
    }
  })

// Read (get) a single employee by ID
router.get('/:id',authAdmin, async (req, res) => {
    try {
        let employee = await employeeModel.findOne({ id: req.params.id });
        res.json(employee);
      }
      catch (err) {
        console.log(err);
        res.status(502).json({ err })
      }
});

// Read (get) the number of documents in the collection
router.patch('/count', authAdmin, async (req, res) => {
  try {
      let count = await employeeModel.estimatedDocumentCount()
      console.log('Document count:', count); // Debug logging
      res.json( {count} );
  } catch (err) {
      console.error('Error fetching document count:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an employee
router.put("/:id",authAdmin, async (req, res) => {
    const validBody = validateEmployee(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details)
    }
    try {
        const updatedEmployee = await employeeModel.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body, $inc: { version: 1 } },
            { new: true }
        );
        res.json(updatedEmployee);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

// Delete an employee
router.delete('/:id',authAdmin,async (req, res) => {
    try{
        const id = req.params.id;
        const data = await employeeModel.deleteOne({id:id});
        res.json(data);
      }
      catch(err){
        console.log(err);
        res.status(502).json({err})
      }
});

module.exports = router;