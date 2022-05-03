export class Environment {
  public static isProd: boolean = process.env.NODE_ENV === 'production';
  public static jwtSecretKey: string | undefined = process.env.JWT_SECRET_KEY;
  public static jwtExpire: string | undefined = process.env.JWT_EXPIRE;
  public static cookieExpire: string | undefined = process.env.COOKIE_EXPIRE!;
  public static port: string | undefined = process.env.PORT;
  public static serverDbUrl: string | undefined = process.env.SERVER_DB_URL;
  public static localDbUrl: string | undefined = process.env.LOCAL_DB_URL;
}
