import { authAPI, apiClient } from '@/lib/secure-api-client';
import { 
  PDFUploadResponse, 
  User, 
  OnboardingProgress, 
  StepCompletionResponse 
} from '@/types';

// Step-specific request interfaces
interface Step1Request {
  file: File;
}

interface Step2Request {
  profile_picture?: File;
  additional_info: string;
  is_looking_for_job: boolean;
}

interface Step3Request {
  current_employment_mode: string[];
  preferred_work_mode: string[];
  preferred_employment_type: string[];
  preferred_location: string;
}

interface Step4Request {
  current_salary: string;
  expected_salary: string;
  notice_period: string;
  availability: string;
}

// Enhanced onboarding service with step-by-step support
export class OnboardingService {
  
  // Get current onboarding status and progress
  static async getOnboardingStatus(token?: string): Promise<OnboardingProgress> {
    return authAPI.get<OnboardingProgress>('/onboarding/status', token);
  }

  // Step 1: Upload and process LinkedIn PDF
  static async completeStep1(pdfFile: File, token?: string): Promise<StepCompletionResponse> {
    return apiClient.uploadFile<StepCompletionResponse>(
      '/onboarding/step-1/pdf-upload',
      pdfFile,
      {},
      token,
      false
    );
  }

  // Step 2: Profile information and picture
  static async completeStep2(data: Step2Request, token?: string): Promise<StepCompletionResponse> {
    const { profile_picture, ...otherData } = data;
    
    // Get current user data first
    const authToken = token || apiClient.getStoredToken();
    if (!authToken) {
      throw {
        type: 'AUTH_ERROR',
        message: 'No authentication token found',
        action: 'REDIRECT_TO_LOGIN'
      };
    }

    // Get current user data to fill required fields
    const currentUser = await authAPI.get<any>('/users/me', authToken);
    
    const formData = new FormData();
    
    // Add profile picture if provided
    if (profile_picture) {
      formData.append('profile_picture', profile_picture);
    }
    
    // Add required fields with current user data or defaults
    formData.append('name', currentUser.name || '');
    formData.append('designation', currentUser.designation || '');
    formData.append('location', currentUser.location || '');
    formData.append('summary', currentUser.summary || '');
    formData.append('additional_info', otherData.additional_info);
    formData.append('is_looking_for_job', otherData.is_looking_for_job.toString());

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/onboarding/step-2/profile-info`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
      body: formData,
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw {
        type: response.status === 422 ? 'VALIDATION_ERROR' : 'GENERIC_ERROR',
        message: responseData.detail || responseData.error || 'Step 2 completion failed',
        detail: responseData.detail,
        errors: responseData.detail
      };
    }
    
    return responseData;
  }

  // Step 3: Work preferences
  static async completeStep3(data: Step3Request, token?: string): Promise<StepCompletionResponse> {
    const formData = new FormData();
    
    // Add work preferences as comma-separated strings
    formData.append('current_employment_mode', data.current_employment_mode.join(','));
    formData.append('preferred_work_mode', data.preferred_work_mode.join(','));
    formData.append('preferred_employment_type', data.preferred_employment_type.join(','));
    formData.append('preferred_location', data.preferred_location);
    formData.append('notice_period', '2 weeks'); // Default value
    formData.append('availability', 'immediate'); // Default value

    const authToken = token || apiClient.getStoredToken();
    
    if (!authToken) {
      throw {
        type: 'AUTH_ERROR',
        message: 'No authentication token found',
        action: 'REDIRECT_TO_LOGIN'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/onboarding/step-3/work-preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
      body: formData,
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw {
        type: response.status === 422 ? 'VALIDATION_ERROR' : 'GENERIC_ERROR',
        message: responseData.detail || responseData.error || 'Step 3 completion failed',
        detail: responseData.detail,
        errors: responseData.detail
      };
    }
    
    return responseData;
  }

  // Step 4: Salary and availability (final step)
  static async completeStep4(data: Step4Request, token?: string): Promise<StepCompletionResponse> {
    const formData = new FormData();
    
    formData.append('current_salary', data.current_salary);
    formData.append('expected_salary', data.expected_salary);
    formData.append('availability', data.availability);
    formData.append('notice_period', data.notice_period);

    const authToken = token || apiClient.getStoredToken();
    
    if (!authToken) {
      throw {
        type: 'AUTH_ERROR',
        message: 'No authentication token found',
        action: 'REDIRECT_TO_LOGIN'
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/onboarding/step-4/salary-availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
      body: formData,
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw {
        type: response.status === 422 ? 'VALIDATION_ERROR' : 'GENERIC_ERROR',
        message: responseData.detail || responseData.error || 'Step 4 completion failed',
        detail: responseData.detail,
        errors: responseData.detail
      };
    }
    
    return responseData;
  }

  // Resume onboarding from a specific step
  static async resumeFromStep(step: number, token?: string): Promise<StepCompletionResponse> {
    return authAPI.post<StepCompletionResponse>(`/onboarding/resume/${step}`, {}, token);
  }

  // Validate if user can access a specific step
  static async canAccessStep(step: number, currentProgress: OnboardingProgress): Promise<boolean> {
    // Users can only access their current step or previous completed steps
    return step <= currentProgress.current_step;
  }

  // Get step status
  static getStepStatus(step: number, progress: OnboardingProgress): string {
    switch (step) {
      case 1:
        return progress.step_1_pdf_upload;
      case 2:
        return progress.step_2_profile_info;
      case 3:
        return progress.step_3_work_preferences;
      case 4:
        return progress.step_4_salary_availability;
      default:
        return 'not_started';
    }
  }

  // Check if step is completed
  static isStepCompleted(step: number, progress: OnboardingProgress): boolean {
    return this.getStepStatus(step, progress) === 'completed';
  }

  // Check if step is accessible
  static isStepAccessible(step: number, progress: OnboardingProgress): boolean {
    // Step 1 is always accessible
    if (step === 1) return true;
    
    // Other steps require previous steps to be completed
    for (let i = 1; i < step; i++) {
      if (!this.isStepCompleted(i, progress)) {
        return false;
      }
    }
    
    return true;
  }

  // Get next accessible step
  static getNextStep(progress: OnboardingProgress): number {
    if (progress.completed) return 5; // All steps completed
    return progress.current_step;
  }

  // Skip to profile: Complete onboarding immediately (requires PDF upload)
  static async skipToProfile(token?: string): Promise<StepCompletionResponse> {
    const authToken = token || apiClient.getStoredToken();
    
    if (!authToken) {
      throw {
        type: 'AUTH_ERROR',
        message: 'Authentication token required',
        detail: null,
        errors: null
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/onboarding/skip-to-profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({}),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw {
        type: response.status === 422 ? 'VALIDATION_ERROR' : 'GENERIC_ERROR',
        message: responseData.detail || responseData.error || 'Skip to profile failed',
        detail: responseData.detail,
        errors: responseData.detail
      };
    }
    
    return responseData;
  }

  // Legacy method for backward compatibility (deprecated)
  static async uploadLinkedInPDF(pdfFile: File, token?: string): Promise<PDFUploadResponse> {
    console.warn('uploadLinkedInPDF is deprecated, use completeStep1 instead');
    const response = await this.completeStep1(pdfFile, token);
    return {
      success: response.success,
      extracted_data: (response as any).extracted_data,
      error: response.message
    };
  }
}

export default OnboardingService;