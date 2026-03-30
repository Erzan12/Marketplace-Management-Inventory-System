import { ApiResponse, ApiResponseOptions, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

//standard responses and custom responses
const BadRequest: ApiResponseOptions = {
  status: 400,
  description: 'Bad Request - Invalid or missing input or parameters',
};

//unauthorized access
const Unauthorized: ApiResponseOptions = {
  status: 401,
  description: 'Unauthorized - You do not have access to this resource',
};

//forbidden
const Forbidden: ApiResponseOptions = {
  status: 403,
  description: 'Forbidden - You do not have access to this resource',
};

//not found
const NotFound: ApiResponseOptions = {
  status: 404,
  description: 'Not Found - The requested resource was not found.',
};

const UserNotFound: ApiResponseOptions = {
  status: 404,
  description: 'Not Found - User not found',
};

//conflicts
const Conflict: ApiResponseOptions = {
  status: 409,
  description: 'Conflict - Resource already exist or duplicate entry',
};

//server error
const InternalServerError: ApiResponseOptions = {
  status: 500,
  description: 'Internal Server Error',
};

//custom group decorators
export function ApiPostResponse(description = 'Resource created successfully') {
  return applyDecorators(
    ApiResponse({ status: 201, description }),
    ApiResponse(BadRequest),
    ApiResponse(Unauthorized),
    ApiResponse(Forbidden),
    ApiResponse(Conflict),
    ApiResponse(InternalServerError),
  );
}

export function ApiGetResponse(description = 'Resource(s) fetch successfully') {
  return applyDecorators(
    ApiResponse({ status: 200, description }),
    ApiResponse(BadRequest),
    ApiResponse(Unauthorized),
    ApiResponse(Forbidden),
    ApiResponse(NotFound),
    ApiResponse(InternalServerError),
  );
}

export function ApiPatchResponse(
  description = 'Resource updated successfully',
) {
  return applyDecorators(
    ApiResponse({ status: 200, description }),
    ApiResponse(BadRequest),
    ApiResponse(Unauthorized),
    ApiResponse(Forbidden),
    ApiResponse(NotFound),
    ApiResponse(InternalServerError),
  );
}

export function ApiLoginResponse(
  description = 'Login successfully - returns JWT Token',
) {
  return applyDecorators(
    ApiResponse({ status: 201, description }),
    ApiResponse(BadRequest),
    ApiResponse(Unauthorized),
    ApiResponse(UserNotFound),
    ApiResponse(InternalServerError),
  );
}

export function ApiDeactivateResponse(
  description = 'Resource deactivated successfully',
) {
  return applyDecorators(
    ApiResponse({ status: 200, description }),
    ApiResponse(BadRequest),
    ApiResponse(Unauthorized),
    ApiResponse(Forbidden),
    ApiResponse(NotFound),
    ApiResponse(InternalServerError),
  );
}

export function ApiActivateResponse(
  description = 'Resource activated successfully',
) {
  return applyDecorators(
    ApiResponse({ status: 200, description }),
    ApiResponse(BadRequest),
    ApiResponse(Unauthorized),
    ApiResponse(Forbidden),
    ApiResponse(NotFound),
    ApiResponse(InternalServerError),
  );
}

export function ApiSecurityClearance(level: number) {
  return applyDecorators(
    ApiOperation({
      summary: `Requires Security Clearance Level ${level}`,
      description: `This endpoint requires a minimun security clearance of level ${level}.`,
    }),
  );
}
