from django.utils.deprecation import MiddlewareMixin
from django.middleware.csrf import CsrfViewMiddleware


class DisableCSRFForAPI(MiddlewareMixin):
    """
    Disable CSRF protection for API endpoints (handled by JWT authentication)
    """
    def process_request(self, request):
        # Exempt API routes from CSRF
        if request.path.startswith('/user/') or request.path.startswith('/expense/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None

