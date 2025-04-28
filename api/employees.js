import express from "express";
const router = express.Router();
export default router;

import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "#db/queries/employees";

// TODO: this file!

router
  .route("/")
  .get(async (req, res) => {
    const employees = await getEmployees();
    res.send(employees);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request must have a body.");

    const { name, birthday, salary } = req.body;
    if (!name || !birthday || !salary)
      return res
        .status(400)
        .send("Request body must have: name, birthday, salary");

    const employee = await createEmployee({ name, birthday, salary });
    res.status(201).send(employee);
  });

// router.param allows us to reuse the logic for parsing the ID parameter!
router.param("id", async (req, res, next, id) => {
  // Use regex to check if the ID is a positive integer
  if (!/^\d+$/.test(id))
    return res.status(400).send("ID must be a positive integer.");

  // Try to find the employee with the specified ID
  const employee = await getEmployee(id);
  if (!employee) return res.status(404).send("Employee not found.");

  // We can attach the employee to the request object, which subsequent middleware can access
  req.employee = employee;
  next();
});

router
  .route("/:id")
  .get((req, res) => {
    res.send(req.employee);
  })
  .put(async (req, res) => {
    if (!req.body) return res.status(400).send("Request must have a body.");

    // Note: we grab the ID from the request parameters, not the body
    const { name, birthday, salary } = req.body;
    if (!name || !birthday || !salary)
      return res
        .status(400)
        .send("Request body must have: name, birthday, salary");

    const employee = await updateEmployee({
      id: req.employee.id,
      name,
      birthday,
      salary,
    });
    res.send(employee);
  })
  .delete(async (req, res) => {
    await deleteEmployee(req.employee.id);
    res.sendStatus(204);
  });
