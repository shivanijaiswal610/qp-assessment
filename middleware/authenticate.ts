import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

module.exports = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token missing.",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_TOKEN as string,
    (err, decoded: any) => {
      if (err !== null || !decoded || !isValidRole(decoded.userType, req.url)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access.",
        });
      }

      next();
    }
  );
};

const isValidRole = (role: string, endpoint: string): boolean => {
  if (role === "Admin") {
    const allowedEndpoints: string[] = ["/items"];
    return allowedEndpoints.some((allowedEndpoint) =>
      endpoint.startsWith(allowedEndpoint)
    );
  } else if (role === "User") {
    const allowedEndpoints: string[] = ["/available/items", "/orders"];
    return allowedEndpoints.some((allowedEndpoint) =>
      endpoint.startsWith(allowedEndpoint)
    );
  }

  return false;
};
