import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";

import { RequestContext } from "./interface";
import { RegisterDto } from "./dto";
import { AuthService } from "./auth.service";
import { JwtAuthenticationGuard, LocalAuthenticationGuard } from "./guard";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) { }

	@Post("register")
	async register(@Body() registrationData: RegisterDto) {
		try {
			const newUser = await this.authService.register(registrationData);
			return newUser;
		}
		catch (error) {
			if (error?.code === "ER_DUP_ENTRY") {
				throw new HttpException(
					"Duplicate email address. Please try another email",
					HttpStatus.CONFLICT
				);
			}
			throw new HttpException(
				"Cannot register. Please contact the admin team",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(LocalAuthenticationGuard)
	@Post("login")
	async logIn(@Req() request: RequestContext) {
		const { user } = request;
		const token = this.authService.generateAuthToken(user.sysId);

		return {
			accessToken: token,
			user,
		};
	}

	@UseGuards(JwtAuthenticationGuard)
	@Get()
	async authenticate(@Req() request: RequestContext) {
		return request.user;
	}
}
