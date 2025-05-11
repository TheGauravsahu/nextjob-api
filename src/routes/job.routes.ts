import { Router } from "express";
import * as jobController from "../controllers/job.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import validateMiddleware from "../middleware/validate.middleware";
import { createJobSchema } from "../validators/job.schema";
import asyncWrapper from "../utils/asyncWrapper";

const router = Router();

router.get("/", asyncWrapper(jobController.getAllJobs));

router.get(
  "/employer-jobs",
  authMiddleware,
  asyncWrapper(jobController.getAllEmployerJobs)
);
router.get(
  "/user-jobs",
  authMiddleware,
  asyncWrapper(jobController.getAllUserAppliedJobs)
);

router.get("/:id", authMiddleware, asyncWrapper(jobController.getJobById));
router.delete(
  "/:id",
  authMiddleware,
  asyncWrapper(jobController.deleteJobById)
);

router.post(
  "/",
  authMiddleware,
  validateMiddleware(createJobSchema),
  asyncWrapper(jobController.createJob)
);

router.put(
  "/:id",
  authMiddleware,
  validateMiddleware(createJobSchema),
  asyncWrapper(jobController.updateJobById)
);

// Apply to a job (USER)
router.post(
  "/:id/apply",
  authMiddleware,
  asyncWrapper(jobController.applyToJob)
);

// View applicants (EMPLOYER)
router.get(
  "/:id/applicants",
  authMiddleware,
  asyncWrapper(jobController.getApplicantsForJob)
);

export default router;
