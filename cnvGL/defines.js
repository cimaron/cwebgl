/*
 * This document is licensed under the SGI Free Software B License Version
 * 2.0. For details, see http://oss.sgi.com/projects/FreeB/ .
 */

/* OpenGL ES core versions */
cnvgl.ES_VERSION_2_0                 = 1;

/* ClearBufferMask */
cnvgl.DEPTH_BUFFER_BIT               = 0x00000100;
cnvgl.ACCUM_BUFFER_BIT               = 0x00000200;
cnvgl.STENCIL_BUFFER_BIT             = 0x00000400;
cnvgl.COLOR_BUFFER_BIT               = 0x00004000;

/* Boolean */
cnvgl.FALSE                          = 0;
cnvgl.TRUE                           = 1;

/* BeginMode */
cnvgl.POINTS                         = 0x0000;
cnvgl.LINES                          = 0x0001;
cnvgl.LINE_LOOP                      = 0x0002;
cnvgl.LINE_STRIP                     = 0x0003;
cnvgl.TRIANGLES                      = 0x0004;
cnvgl.TRIANGLE_STRIP                 = 0x0005;
cnvgl.TRIANGLE_FAN                   = 0x0006;

/* AlphaFunction (not supported in ES20) */
/*      cnvgl.NEVER */
/*      cnvgl.LESS */
/*      cnvgl.EQUAL */
/*      cnvgl.LEQUAL */
/*      cnvgl.GREATER */
/*      cnvgl.NOTEQUAL */
/*      cnvgl.GEQUAL */
/*      cnvgl.ALWAYS */

/* BlendingFactorDest */
cnvgl.ZERO                           = 0;
cnvgl.ONE                            = 1;
cnvgl.SRC_COLOR                      = 0x0300;
cnvgl.ONE_MINUS_SRC_COLOR            = 0x0301;
cnvgl.SRC_ALPHA                      = 0x0302;
cnvgl.ONE_MINUS_SRC_ALPHA            = 0x0303;
cnvgl.DST_ALPHA                      = 0x0304;
cnvgl.ONE_MINUS_DST_ALPHA            = 0x0305;

/* BlendingFactorSrc */
/*      cnvgl.ZERO */
/*      cnvgl.ONE */
cnvgl.DST_COLOR                      = 0x0306;
cnvgl.ONE_MINUS_DST_COLOR            = 0x0307;
cnvgl.SRC_ALPHA_SATURATE             = 0x0308;
/*      cnvgl.SRC_ALPHA */
/*      cnvgl.ONE_MINUS_SRC_ALPHA */
/*      cnvgl.DST_ALPHA */
/*      cnvgl.ONE_MINUS_DST_ALPHA */

/* BlendEquationSeparate */
cnvgl.FUNC_ADD                       = 0x8006;
cnvgl.BLEND_EQUATION                 = 0x8009;
cnvgl.BLEND_EQUATION_RGB             = 0x8009;    /* same as BLEND_EQUATION */
cnvgl.BLEND_EQUATION_ALPHA           = 0x883D;

/* BlendSubtract */
cnvgl.FUNC_SUBTRACT                  = 0x800A;
cnvgl.FUNC_REVERSE_SUBTRACT          = 0x800B;

/* Separate Blend Functions */
cnvgl.BLEND_DST_RGB                  = 0x80C8;
cnvgl.BLEND_SRC_RGB                  = 0x80C9;
cnvgl.BLEND_DST_ALPHA                = 0x80CA;
cnvgl.BLEND_SRC_ALPHA                = 0x80CB;
cnvgl.CONSTANT_COLOR                 = 0x8001;
cnvgl.ONE_MINUS_CONSTANT_COLOR       = 0x8002;
cnvgl.CONSTANT_ALPHA                 = 0x8003;
cnvgl.ONE_MINUS_CONSTANT_ALPHA       = 0x8004;
cnvgl.BLEND_COLOR                    = 0x8005;

/* Buffer Objects */
cnvgl.ARRAY_BUFFER                   = 0x8892;
cnvgl.ELEMENT_ARRAY_BUFFER           = 0x8893;
cnvgl.ARRAY_BUFFER_BINDING           = 0x8894;
cnvgl.ELEMENT_ARRAY_BUFFER_BINDING   = 0x8895;

cnvgl.STREAM_DRAW                    = 0x88E0;
cnvgl.STREAM_READ                    = 0x88E1;
cnvgl.STREAM_COPY                    = 0x88E2;
cnvgl.STATIC_DRAW                    = 0x88E4;
cnvgl.STATIC_READ                    = 0x88E5;
cnvgl.STATIC_COPY                    = 0x88E6;
cnvgl.DYNAMIC_DRAW                   = 0x88E8;
cnvgl.DYNAMIC_READ                   = 0x88E9;
cnvgl.DYNAMIC_COPY                   = 0x88EA;

cnvgl.BUFFER_SIZE                    = 0x8764;
cnvgl.BUFFER_USAGE                   = 0x8765;

cnvgl.CURRENT_VERTEX_ATTRIB          = 0x8626;

/* CullFaceMode */
cnvgl.FRONT                          = 0x0404;
cnvgl.BACK                           = 0x0405;
cnvgl.FRONT_AND_BACK                 = 0x0408;

/* DepthFunction */
/*      cnvgl.NEVER */
/*      cnvgl.LESS */
/*      cnvgl.EQUAL */
/*      cnvgl.LEQUAL */
/*      cnvgl.GREATER */
/*      cnvgl.NOTEQUAL */
/*      cnvgl.GEQUAL */
/*      cnvgl.ALWAYS */

/* EnableCap */
cnvgl.TEXTURE_2D                     = 0x0DE1;
cnvgl.CULL_FACE                      = 0x0B44;
cnvgl.BLEND                          = 0x0BE2;
cnvgl.DITHER                         = 0x0BD0;
cnvgl.STENCIL_TEST                   = 0x0B90;
cnvgl.DEPTH_TEST                     = 0x0B71;
cnvgl.SCISSOR_TEST                   = 0x0C11;
cnvgl.POLYGON_OFFSET_FILL            = 0x8037;
cnvgl.SAMPLE_ALPHA_TO_COVERAGE       = 0x809E;
cnvgl.SAMPLE_COVERAGE                = 0x80A0;

/* ErrorCode */
cnvgl.NO_ERROR                       = 0;
cnvgl.INVALID_ENUM                   = 0x0500;
cnvgl.INVALID_VALUE                  = 0x0501;
cnvgl.INVALID_OPERATION              = 0x0502;
cnvgl.OUT_OF_MEMORY                  = 0x0505;

/* FrontFaceDirection */
cnvgl.CW                             = 0x0900;
cnvgl.CCW                            = 0x0901;

/* GetPName */
cnvgl.LINE_WIDTH                     = 0x0B21;
cnvgl.ALIASED_POINT_SIZE_RANGE       = 0x846D;
cnvgl.ALIASED_LINE_WIDTH_RANGE       = 0x846E;
cnvgl.CULL_FACE_MODE                 = 0x0B45;
cnvgl.FRONT_FACE                     = 0x0B46;
cnvgl.DEPTH_RANGE                    = 0x0B70;
cnvgl.DEPTH_WRITEMASK                = 0x0B72;
cnvgl.DEPTH_CLEAR_VALUE              = 0x0B73;
cnvgl.DEPTH_FUNC                     = 0x0B74;
cnvgl.STENCIL_CLEAR_VALUE            = 0x0B91;
cnvgl.STENCIL_FUNC                   = 0x0B92;
cnvgl.STENCIL_FAIL                   = 0x0B94;
cnvgl.STENCIL_PASS_DEPTH_FAIL        = 0x0B95;
cnvgl.STENCIL_PASS_DEPTH_PASS        = 0x0B96;
cnvgl.STENCIL_REF                    = 0x0B97;
cnvgl.STENCIL_VALUE_MASK             = 0x0B93;
cnvgl.STENCIL_WRITEMASK              = 0x0B98;
cnvgl.STENCIL_BACK_FUNC              = 0x8800;
cnvgl.STENCIL_BACK_FAIL              = 0x8801;
cnvgl.STENCIL_BACK_PASS_DEPTH_FAIL   = 0x8802;
cnvgl.STENCIL_BACK_PASS_DEPTH_PASS   = 0x8803;
cnvgl.STENCIL_BACK_REF               = 0x8CA3;
cnvgl.STENCIL_BACK_VALUE_MASK        = 0x8CA4;
cnvgl.STENCIL_BACK_WRITEMASK         = 0x8CA5;
cnvgl.VIEWPORT                       = 0x0BA2;
cnvgl.SCISSOR_BOX                    = 0x0C10;
/*      cnvgl.SCISSOR_TEST */
cnvgl.COLOR_CLEAR_VALUE              = 0x0C22;
cnvgl.COLOR_WRITEMASK                = 0x0C23;
cnvgl.UNPACK_ALIGNMENT               = 0x0CF5;
cnvgl.PACK_ALIGNMENT                 = 0x0D05;
cnvgl.MAX_TEXTURE_SIZE               = 0x0D33;
cnvgl.MAX_VIEWPORT_DIMS              = 0x0D3A;
cnvgl.SUBPIXEL_BITS                  = 0x0D50;
cnvgl.RED_BITS                       = 0x0D52;
cnvgl.GREEN_BITS                     = 0x0D53;
cnvgl.BLUE_BITS                      = 0x0D54;
cnvgl.ALPHA_BITS                     = 0x0D55;
cnvgl.DEPTH_BITS                     = 0x0D56;
cnvgl.STENCIL_BITS                   = 0x0D57;
cnvgl.POLYGON_OFFSET_UNITS           = 0x2A00;
/*      cnvgl.POLYGON_OFFSET_FILL */
cnvgl.POLYGON_OFFSET_FACTOR          = 0x8038;
cnvgl.TEXTURE_BINDING_2D             = 0x8069;
cnvgl.SAMPLE_BUFFERS                 = 0x80A8;
cnvgl.SAMPLES                        = 0x80A9;
cnvgl.SAMPLE_COVERAGE_VALUE          = 0x80AA;
cnvgl.SAMPLE_COVERAGE_INVERT         = 0x80AB;

/* GetTextureParameter */
/*      cnvgl.TEXTURE_MAG_FILTER */
/*      cnvgl.TEXTURE_MIN_FILTER */
/*      cnvgl.TEXTURE_WRAP_S */
/*      cnvgl.TEXTURE_WRAP_T */

cnvgl.NUM_COMPRESSED_TEXTURE_FORMATS = 0x86A2;
cnvgl.COMPRESSED_TEXTURE_FORMATS     = 0x86A3;

/* HintMode */
cnvgl.DONT_CARE                      = 0x1100;
cnvgl.FASTEST                        = 0x1101;
cnvgl.NICEST                         = 0x1102;

/* HintTarget */
cnvgl.GENERATE_MIPMAP_HINT            = 0x8192;

/* DataType */
cnvgl.BYTE                           = 0x1400;
cnvgl.UNSIGNED_BYTE                  = 0x1401;
cnvgl.SHORT                          = 0x1402;
cnvgl.UNSIGNED_SHORT                 = 0x1403;
cnvgl.INT                            = 0x1404;
cnvgl.UNSIGNED_INT                   = 0x1405;
cnvgl.FLOAT                          = 0x1406;
cnvgl.DOUBLE                         = 0x140A;
cnvgl.FIXED                          = 0x140C;

/* PixelFormat */
cnvgl.DEPTH_COMPONENT                = 0x1902;
cnvgl.ALPHA                          = 0x1906;
cnvgl.RGB                            = 0x1907;
cnvgl.RGBA                           = 0x1908;
cnvgl.LUMINANCE                      = 0x1909;
cnvgl.LUMINANCE_ALPHA                = 0x190A;

/* PixelType */
/*      cnvgl.UNSIGNED_BYTE */
cnvgl.UNSIGNED_SHORT_4_4_4_4         = 0x8033;
cnvgl.UNSIGNED_SHORT_5_5_5_1         = 0x8034;
cnvgl.UNSIGNED_SHORT_5_6_5           = 0x8363;

/* Shaders */
cnvgl.FRAGMENT_SHADER                  = 0x8B30;
cnvgl.VERTEX_SHADER                    = 0x8B31;
cnvgl.MAX_VERTEX_ATTRIBS               = 0x8869;
cnvgl.MAX_VERTEX_UNIFORM_VECTORS       = 0x8DFB;
cnvgl.MAX_VARYING_VECTORS              = 0x8DFC;
cnvgl.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
cnvgl.MAX_VERTEX_TEXTURE_IMAGE_UNITS   = 0x8B4C;
cnvgl.MAX_TEXTURE_IMAGE_UNITS          = 0x8872;
cnvgl.MAX_FRAGMENT_UNIFORM_VECTORS     = 0x8DFD;
cnvgl.SHADER_TYPE                      = 0x8B4F;
cnvgl.DELETE_STATUS                    = 0x8B80;
cnvgl.LINK_STATUS                      = 0x8B82;
cnvgl.VALIDATE_STATUS                  = 0x8B83;
cnvgl.ATTACHED_SHADERS                 = 0x8B85;
cnvgl.ACTIVE_UNIFORMS                  = 0x8B86;
cnvgl.ACTIVE_UNIFORM_MAX_LENGTH        = 0x8B87;
cnvgl.ACTIVE_ATTRIBUTES                = 0x8B89;
cnvgl.ACTIVE_ATTRIBUTE_MAX_LENGTH      = 0x8B8A;
cnvgl.SHADING_LANGUAGE_VERSION         = 0x8B8C;
cnvgl.CURRENT_PROGRAM                  = 0x8B8D;

/* StencilFunction */
cnvgl.NEVER                          = 0x0200;
cnvgl.LESS                           = 0x0201;
cnvgl.EQUAL                          = 0x0202;
cnvgl.LEQUAL                         = 0x0203;
cnvgl.GREATER                        = 0x0204;
cnvgl.NOTEQUAL                       = 0x0205;
cnvgl.GEQUAL                         = 0x0206;
cnvgl.ALWAYS                         = 0x0207;

/* StencilOp */
/*      cnvgl.ZERO */
cnvgl.KEEP                           = 0x1E00;
cnvgl.REPLACE                        = 0x1E01;
cnvgl.INCR                           = 0x1E02;
cnvgl.DECR                           = 0x1E03;
cnvgl.INVERT                         = 0x150A;
cnvgl.INCR_WRAP                      = 0x8507;
cnvgl.DECR_WRAP                      = 0x8508;

/* StringName */
cnvgl.VENDOR                         = 0x1F00;
cnvgl.RENDERER                       = 0x1F01;
cnvgl.VERSION                        = 0x1F02;
cnvgl.EXTENSIONS                     = 0x1F03;

/* TextureMagFilter */
cnvgl.NEAREST                        = 0x2600;
cnvgl.LINEAR                         = 0x2601;

/* TextureMinFilter */
/*      cnvgl.NEAREST */
/*      cnvgl.LINEAR */
cnvgl.NEAREST_MIPMAP_NEAREST         = 0x2700;
cnvgl.LINEAR_MIPMAP_NEAREST          = 0x2701;
cnvgl.NEAREST_MIPMAP_LINEAR          = 0x2702;
cnvgl.LINEAR_MIPMAP_LINEAR           = 0x2703;

/* TextureParameterName */
cnvgl.TEXTURE_MAG_FILTER             = 0x2800;
cnvgl.TEXTURE_MIN_FILTER             = 0x2801;
cnvgl.TEXTURE_WRAP_S                 = 0x2802;
cnvgl.TEXTURE_WRAP_T                 = 0x2803;

/* TextureTarget */
/*      cnvgl.TEXTURE_2D */
cnvgl.TEXTURE                        = 0x1702;

cnvgl.TEXTURE_CUBE_MAP               = 0x8513;
cnvgl.TEXTURE_BINDING_CUBE_MAP       = 0x8514;
cnvgl.TEXTURE_CUBE_MAP_POSITIVE_X    = 0x8515;
cnvgl.TEXTURE_CUBE_MAP_NEGATIVE_X    = 0x8516;
cnvgl.TEXTURE_CUBE_MAP_POSITIVE_Y    = 0x8517;
cnvgl.TEXTURE_CUBE_MAP_NEGATIVE_Y    = 0x8518;
cnvgl.TEXTURE_CUBE_MAP_POSITIVE_Z    = 0x8519;
cnvgl.TEXTURE_CUBE_MAP_NEGATIVE_Z    = 0x851A;
cnvgl.MAX_CUBE_MAP_TEXTURE_SIZE      = 0x851C;

/* TextureUnit */
cnvgl.TEXTURE0                       = 0x84C0;
cnvgl.TEXTURE1                       = 0x84C1;
cnvgl.TEXTURE2                       = 0x84C2;
cnvgl.TEXTURE3                       = 0x84C3;
cnvgl.TEXTURE4                       = 0x84C4;
cnvgl.TEXTURE5                       = 0x84C5;
cnvgl.TEXTURE6                       = 0x84C6;
cnvgl.TEXTURE7                       = 0x84C7;
cnvgl.TEXTURE8                       = 0x84C8;
cnvgl.TEXTURE9                       = 0x84C9;
cnvgl.TEXTURE10                      = 0x84CA;
cnvgl.TEXTURE11                      = 0x84CB;
cnvgl.TEXTURE12                      = 0x84CC;
cnvgl.TEXTURE13                      = 0x84CD;
cnvgl.TEXTURE14                      = 0x84CE;
cnvgl.TEXTURE15                      = 0x84CF;
cnvgl.TEXTURE16                      = 0x84D0;
cnvgl.TEXTURE17                      = 0x84D1;
cnvgl.TEXTURE18                      = 0x84D2;
cnvgl.TEXTURE19                      = 0x84D3;
cnvgl.TEXTURE20                      = 0x84D4;
cnvgl.TEXTURE21                      = 0x84D5;
cnvgl.TEXTURE22                      = 0x84D6;
cnvgl.TEXTURE23                      = 0x84D7;
cnvgl.TEXTURE24                      = 0x84D8;
cnvgl.TEXTURE25                      = 0x84D9;
cnvgl.TEXTURE26                      = 0x84DA;
cnvgl.TEXTURE27                      = 0x84DB;
cnvgl.TEXTURE28                      = 0x84DC;
cnvgl.TEXTURE29                      = 0x84DD;
cnvgl.TEXTURE30                      = 0x84DE;
cnvgl.TEXTURE31                      = 0x84DF;
cnvgl.ACTIVE_TEXTURE                 = 0x84E0;

/* TextureWrapMode */
cnvgl.REPEAT                         = 0x2901;
cnvgl.CLAMP_TO_EDGE                  = 0x812F;
cnvgl.MIRRORED_REPEAT                = 0x8370;

/* Uniform Types */
cnvgl.FLOAT_VEC2                     = 0x8B50;
cnvgl.FLOAT_VEC3                     = 0x8B51;
cnvgl.FLOAT_VEC4                     = 0x8B52;
cnvgl.INT_VEC2                       = 0x8B53;
cnvgl.INT_VEC3                       = 0x8B54;
cnvgl.INT_VEC4                       = 0x8B55;
cnvgl.BOOL                           = 0x8B56;
cnvgl.BOOL_VEC2                      = 0x8B57;
cnvgl.BOOL_VEC3                      = 0x8B58;
cnvgl.BOOL_VEC4                      = 0x8B59;
cnvgl.FLOAT_MAT2                     = 0x8B5A;
cnvgl.FLOAT_MAT3                     = 0x8B5B;
cnvgl.FLOAT_MAT4                     = 0x8B5C;
cnvgl.SAMPLER_2D                     = 0x8B5E;
cnvgl.SAMPLER_CUBE                   = 0x8B60;

/* Vertex Arrays */
cnvgl.VERTEX_ATTRIB_ARRAY_ENABLED        = 0x8622;
cnvgl.VERTEX_ATTRIB_ARRAY_SIZE           = 0x8623;
cnvgl.VERTEX_ATTRIB_ARRAY_STRIDE         = 0x8624;
cnvgl.VERTEX_ATTRIB_ARRAY_TYPE           = 0x8625;
cnvgl.VERTEX_ATTRIB_ARRAY_NORMALIZED     = 0x886A;
cnvgl.VERTEX_ATTRIB_ARRAY_POINTER        = 0x8645;
cnvgl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F;

/* Read Format */
cnvgl.IMPLEMENTATION_COLOR_READ_TYPE   = 0x8B9A;
cnvgl.IMPLEMENTATION_COLOR_READ_FORMAT = 0x8B9B;

/* Shader Source */
cnvgl.COMPILE_STATUS                 = 0x8B81;
cnvgl.INFO_LOG_LENGTH                = 0x8B84;
cnvgl.SHADER_SOURCE_LENGTH           = 0x8B88;
cnvgl.SHADER_COMPILER                = 0x8DFA;

/* Shader Binary */
cnvgl.SHADER_BINARY_FORMATS          = 0x8DF8;
cnvgl.NUM_SHADER_BINARY_FORMATS      = 0x8DF9;

/* Shader Precision-Specified Types */
cnvgl.LOW_FLOAT                      = 0x8DF0;
cnvgl.MEDIUM_FLOAT                   = 0x8DF1;
cnvgl.HIGH_FLOAT                     = 0x8DF2;
cnvgl.LOW_INT                        = 0x8DF3;
cnvgl.MEDIUM_INT                     = 0x8DF4;
cnvgl.HIGH_INT                       = 0x8DF5;

/* Framebuffer Object. */
cnvgl.FRAMEBUFFER                    = 0x8D40;
cnvgl.RENDERBUFFER                   = 0x8D41;

cnvgl.RGBA4                          = 0x8056;
cnvgl.RGB5_A1                        = 0x8057;
cnvgl.RGB565                         = 0x8D62;
cnvgl.DEPTH_COMPONENT16              = 0x81A5;
cnvgl.STENCIL_INDEX                  = 0x1901;
cnvgl.STENCIL_INDEX8                 = 0x8D48;

cnvgl.RENDERBUFFER_WIDTH             = 0x8D42;
cnvgl.RENDERBUFFER_HEIGHT            = 0x8D43;
cnvgl.RENDERBUFFER_INTERNAL_FORMAT   = 0x8D44;
cnvgl.RENDERBUFFER_RED_SIZE          = 0x8D50;
cnvgl.RENDERBUFFER_GREEN_SIZE        = 0x8D51;
cnvgl.RENDERBUFFER_BLUE_SIZE         = 0x8D52;
cnvgl.RENDERBUFFER_ALPHA_SIZE        = 0x8D53;
cnvgl.RENDERBUFFER_DEPTH_SIZE        = 0x8D54;
cnvgl.RENDERBUFFER_STENCIL_SIZE      = 0x8D55;

cnvgl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE           = 0x8CD0;
cnvgl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME           = 0x8CD1;
cnvgl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL         = 0x8CD2;
cnvgl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3;

cnvgl.COLOR_ATTACHMENT0              = 0x8CE0;
cnvgl.DEPTH_ATTACHMENT               = 0x8D00;
cnvgl.STENCIL_ATTACHMENT             = 0x8D20;

cnvgl.NONE                           = 0;

cnvgl.FRAMEBUFFER_COMPLETE                      = 0x8CD5;
cnvgl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT         = 0x8CD6;
cnvgl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
cnvgl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS         = 0x8CD9;
cnvgl.FRAMEBUFFER_UNSUPPORTED                   = 0x8CDD;

cnvgl.FRAMEBUFFER_BINDING            = 0x8CA6;
cnvgl.RENDERBUFFER_BINDING           = 0x8CA7;
cnvgl.MAX_RENDERBUFFER_SIZE          = 0x84E8;

cnvgl.INVALID_FRAMEBUFFER_OPERATION  = 0x0506;




cnvgl.MAX_FRAGMENT_UNIFORM_COMPONENTS = 0x8B49;

/* Texture mapping */
cnvgl.TEXTURE_1D					= 0x0DE0;
cnvgl.TEXTURE_2D					= 0x0DE1;
cnvgl.TEXTURE_3D					= 0x806F;

cnvgl.READ_WRITE					= 0x88BA;

cnvgl.DEPTH_COMPONENT16				= 0x81A5;
