/*
 * This document is licensed under the SGI Free Software B License Version
 * 2.0. For details, see http://oss.sgi.com/projects/FreeB/ .
 */

/* OpenGL ES core versions */
var GL_ES_VERSION_2_0                 = 1;

/* ClearBufferMask */
var GL_DEPTH_BUFFER_BIT               = 0x00000100;
var GL_ACCUM_BUFFER_BIT               = 0x00000200;
var GL_STENCIL_BUFFER_BIT             = 0x00000400;
var GL_COLOR_BUFFER_BIT               = 0x00004000;

/* Boolean */
var GL_FALSE                          = 0;
var GL_TRUE                           = 1;

/* BeginMode */
var GL_POINTS                         = 0x0000;
var GL_LINES                          = 0x0001;
var GL_LINE_LOOP                      = 0x0002;
var GL_LINE_STRIP                     = 0x0003;
var GL_TRIANGLES                      = 0x0004;
var GL_TRIANGLE_STRIP                 = 0x0005;
var GL_TRIANGLE_FAN                   = 0x0006;

/* AlphaFunction (not supported in ES20) */
/*      GL_NEVER */
/*      GL_LESS */
/*      GL_EQUAL */
/*      GL_LEQUAL */
/*      GL_GREATER */
/*      GL_NOTEQUAL */
/*      GL_GEQUAL */
/*      GL_ALWAYS */

/* BlendingFactorDest */
var GL_ZERO                           = 0;
var GL_ONE                            = 1;
var GL_SRC_COLOR                      = 0x0300;
var GL_ONE_MINUS_SRC_COLOR            = 0x0301;
var GL_SRC_ALPHA                      = 0x0302;
var GL_ONE_MINUS_SRC_ALPHA            = 0x0303;
var GL_DST_ALPHA                      = 0x0304;
var GL_ONE_MINUS_DST_ALPHA            = 0x0305;

/* BlendingFactorSrc */
/*      GL_ZERO */
/*      GL_ONE */
var GL_DST_COLOR                      = 0x0306;
var GL_ONE_MINUS_DST_COLOR            = 0x0307;
var GL_SRC_ALPHA_SATURATE             = 0x0308;
/*      GL_SRC_ALPHA */
/*      GL_ONE_MINUS_SRC_ALPHA */
/*      GL_DST_ALPHA */
/*      GL_ONE_MINUS_DST_ALPHA */

/* BlendEquationSeparate */
var GL_FUNC_ADD                       = 0x8006;
var GL_BLEND_EQUATION                 = 0x8009;
var GL_BLEND_EQUATION_RGB             = 0x8009;    /* same as BLEND_EQUATION */
var GL_BLEND_EQUATION_ALPHA           = 0x883D;

/* BlendSubtract */
var GL_FUNC_SUBTRACT                  = 0x800A;
var GL_FUNC_REVERSE_SUBTRACT          = 0x800B;

/* Separate Blend Functions */
var GL_BLEND_DST_RGB                  = 0x80C8;
var GL_BLEND_SRC_RGB                  = 0x80C9;
var GL_BLEND_DST_ALPHA                = 0x80CA;
var GL_BLEND_SRC_ALPHA                = 0x80CB;
var GL_CONSTANT_COLOR                 = 0x8001;
var GL_ONE_MINUS_CONSTANT_COLOR       = 0x8002;
var GL_CONSTANT_ALPHA                 = 0x8003;
var GL_ONE_MINUS_CONSTANT_ALPHA       = 0x8004;
var GL_BLEND_COLOR                    = 0x8005;

/* Buffer Objects */
var GL_ARRAY_BUFFER                   = 0x8892;
var GL_ELEMENT_ARRAY_BUFFER           = 0x8893;
var GL_ARRAY_BUFFER_BINDING           = 0x8894;
var GL_ELEMENT_ARRAY_BUFFER_BINDING   = 0x8895;

var GL_STREAM_DRAW                    = 0x88E0;
var GL_STREAM_READ                    = 0x88E1;
var GL_STREAM_COPY                    = 0x88E2;
var GL_STATIC_DRAW                    = 0x88E4;
var GL_DYNAMIC_DRAW                   = 0x88E8;

var GL_BUFFER_SIZE                    = 0x8764;
var GL_BUFFER_USAGE                   = 0x8765;

var GL_CURRENT_VERTEX_ATTRIB          = 0x8626;

/* CullFaceMode */
var GL_FRONT                          = 0x0404;
var GL_BACK                           = 0x0405;
var GL_FRONT_AND_BACK                 = 0x0408;

/* DepthFunction */
/*      GL_NEVER */
/*      GL_LESS */
/*      GL_EQUAL */
/*      GL_LEQUAL */
/*      GL_GREATER */
/*      GL_NOTEQUAL */
/*      GL_GEQUAL */
/*      GL_ALWAYS */

/* EnableCap */
var GL_TEXTURE_2D                     = 0x0DE1;
var GL_CULL_FACE                      = 0x0B44;
var GL_BLEND                          = 0x0BE2;
var GL_DITHER                         = 0x0BD0;
var GL_STENCIL_TEST                   = 0x0B90;
var GL_DEPTH_TEST                     = 0x0B71;
var GL_SCISSOR_TEST                   = 0x0C11;
var GL_POLYGON_OFFSET_FILL            = 0x8037;
var GL_SAMPLE_ALPHA_TO_COVERAGE       = 0x809E;
var GL_SAMPLE_COVERAGE                = 0x80A0;

/* ErrorCode */
var GL_NO_ERROR                       = 0;
var GL_INVALID_ENUM                   = 0x0500;
var GL_INVALID_VALUE                  = 0x0501;
var GL_INVALID_OPERATION              = 0x0502;
var GL_OUT_OF_MEMORY                  = 0x0505;

/* FrontFaceDirection */
var GL_CW                             = 0x0900;
var GL_CCW                            = 0x0901;

/* GetPName */
var GL_LINE_WIDTH                     = 0x0B21;
var GL_ALIASED_POINT_SIZE_RANGE       = 0x846D;
var GL_ALIASED_LINE_WIDTH_RANGE       = 0x846E;
var GL_CULL_FACE_MODE                 = 0x0B45;
var GL_FRONT_FACE                     = 0x0B46;
var GL_DEPTH_RANGE                    = 0x0B70;
var GL_DEPTH_WRITEMASK                = 0x0B72;
var GL_DEPTH_CLEAR_VALUE              = 0x0B73;
var GL_DEPTH_FUNC                     = 0x0B74;
var GL_STENCIL_CLEAR_VALUE            = 0x0B91;
var GL_STENCIL_FUNC                   = 0x0B92;
var GL_STENCIL_FAIL                   = 0x0B94;
var GL_STENCIL_PASS_DEPTH_FAIL        = 0x0B95;
var GL_STENCIL_PASS_DEPTH_PASS        = 0x0B96;
var GL_STENCIL_REF                    = 0x0B97;
var GL_STENCIL_VALUE_MASK             = 0x0B93;
var GL_STENCIL_WRITEMASK              = 0x0B98;
var GL_STENCIL_BACK_FUNC              = 0x8800;
var GL_STENCIL_BACK_FAIL              = 0x8801;
var GL_STENCIL_BACK_PASS_DEPTH_FAIL   = 0x8802;
var GL_STENCIL_BACK_PASS_DEPTH_PASS   = 0x8803;
var GL_STENCIL_BACK_REF               = 0x8CA3;
var GL_STENCIL_BACK_VALUE_MASK        = 0x8CA4;
var GL_STENCIL_BACK_WRITEMASK         = 0x8CA5;
var GL_VIEWPORT                       = 0x0BA2;
var GL_SCISSOR_BOX                    = 0x0C10;
/*      GL_SCISSOR_TEST */
var GL_COLOR_CLEAR_VALUE              = 0x0C22;
var GL_COLOR_WRITEMASK                = 0x0C23;
var GL_UNPACK_ALIGNMENT               = 0x0CF5;
var GL_PACK_ALIGNMENT                 = 0x0D05;
var GL_MAX_TEXTURE_SIZE               = 0x0D33;
var GL_MAX_VIEWPORT_DIMS              = 0x0D3A;
var GL_SUBPIXEL_BITS                  = 0x0D50;
var GL_RED_BITS                       = 0x0D52;
var GL_GREEN_BITS                     = 0x0D53;
var GL_BLUE_BITS                      = 0x0D54;
var GL_ALPHA_BITS                     = 0x0D55;
var GL_DEPTH_BITS                     = 0x0D56;
var GL_STENCIL_BITS                   = 0x0D57;
var GL_POLYGON_OFFSET_UNITS           = 0x2A00;
/*      GL_POLYGON_OFFSET_FILL */
var GL_POLYGON_OFFSET_FACTOR          = 0x8038;
var GL_TEXTURE_BINDING_2D             = 0x8069;
var GL_SAMPLE_BUFFERS                 = 0x80A8;
var GL_SAMPLES                        = 0x80A9;
var GL_SAMPLE_COVERAGE_VALUE          = 0x80AA;
var GL_SAMPLE_COVERAGE_INVERT         = 0x80AB;

/* GetTextureParameter */
/*      GL_TEXTURE_MAG_FILTER */
/*      GL_TEXTURE_MIN_FILTER */
/*      GL_TEXTURE_WRAP_S */
/*      GL_TEXTURE_WRAP_T */

var GL_NUM_COMPRESSED_TEXTURE_FORMATS = 0x86A2;
var GL_COMPRESSED_TEXTURE_FORMATS     = 0x86A3;

/* HintMode */
var GL_DONT_CARE                      = 0x1100;
var GL_FASTEST                        = 0x1101;
var GL_NICEST                         = 0x1102;

/* HintTarget */
var GL_GENERATE_MIPMAP_HINT            = 0x8192;

/* DataType */
var GL_BYTE                           = 0x1400;
var GL_UNSIGNED_BYTE                  = 0x1401;
var GL_SHORT                          = 0x1402;
var GL_UNSIGNED_SHORT                 = 0x1403;
var GL_INT                            = 0x1404;
var GL_UNSIGNED_INT                   = 0x1405;
var GL_FLOAT                          = 0x1406;
var GL_DOUBLE                         = 0x140A;
var GL_FIXED                          = 0x140C;

/* PixelFormat */
var GL_DEPTH_COMPONENT                = 0x1902;
var GL_ALPHA                          = 0x1906;
var GL_RGB                            = 0x1907;
var GL_RGBA                           = 0x1908;
var GL_LUMINANCE                      = 0x1909;
var GL_LUMINANCE_ALPHA                = 0x190A;

/* PixelType */
/*      GL_UNSIGNED_BYTE */
var GL_UNSIGNED_SHORT_4_4_4_4         = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1         = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5           = 0x8363;

/* Shaders */
var GL_FRAGMENT_SHADER                  = 0x8B30;
var GL_VERTEX_SHADER                    = 0x8B31;
var GL_MAX_VERTEX_ATTRIBS               = 0x8869;
var GL_MAX_VERTEX_UNIFORM_VECTORS       = 0x8DFB;
var GL_MAX_VARYING_VECTORS              = 0x8DFC;
var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS   = 0x8B4C;
var GL_MAX_TEXTURE_IMAGE_UNITS          = 0x8872;
var GL_MAX_FRAGMENT_UNIFORM_VECTORS     = 0x8DFD;
var GL_SHADER_TYPE                      = 0x8B4F;
var GL_DELETE_STATUS                    = 0x8B80;
var GL_LINK_STATUS                      = 0x8B82;
var GL_VALIDATE_STATUS                  = 0x8B83;
var GL_ATTACHED_SHADERS                 = 0x8B85;
var GL_ACTIVE_UNIFORMS                  = 0x8B86;
var GL_ACTIVE_UNIFORM_MAX_LENGTH        = 0x8B87;
var GL_ACTIVE_ATTRIBUTES                = 0x8B89;
var GL_ACTIVE_ATTRIBUTE_MAX_LENGTH      = 0x8B8A;
var GL_SHADING_LANGUAGE_VERSION         = 0x8B8C;
var GL_CURRENT_PROGRAM                  = 0x8B8D;

/* StencilFunction */
var GL_NEVER                          = 0x0200;
var GL_LESS                           = 0x0201;
var GL_EQUAL                          = 0x0202;
var GL_LEQUAL                         = 0x0203;
var GL_GREATER                        = 0x0204;
var GL_NOTEQUAL                       = 0x0205;
var GL_GEQUAL                         = 0x0206;
var GL_ALWAYS                         = 0x0207;

/* StencilOp */
/*      GL_ZERO */
var GL_KEEP                           = 0x1E00;
var GL_REPLACE                        = 0x1E01;
var GL_INCR                           = 0x1E02;
var GL_DECR                           = 0x1E03;
var GL_INVERT                         = 0x150A;
var GL_INCR_WRAP                      = 0x8507;
var GL_DECR_WRAP                      = 0x8508;

/* StringName */
var GL_VENDOR                         = 0x1F00;
var GL_RENDERER                       = 0x1F01;
var GL_VERSION                        = 0x1F02;
var GL_EXTENSIONS                     = 0x1F03;

/* TextureMagFilter */
var GL_NEAREST                        = 0x2600;
var GL_LINEAR                         = 0x2601;

/* TextureMinFilter */
/*      GL_NEAREST */
/*      GL_LINEAR */
var GL_NEAREST_MIPMAP_NEAREST         = 0x2700;
var GL_LINEAR_MIPMAP_NEAREST          = 0x2701;
var GL_NEAREST_MIPMAP_LINEAR          = 0x2702;
var GL_LINEAR_MIPMAP_LINEAR           = 0x2703;

/* TextureParameterName */
var GL_TEXTURE_MAG_FILTER             = 0x2800;
var GL_TEXTURE_MIN_FILTER             = 0x2801;
var GL_TEXTURE_WRAP_S                 = 0x2802;
var GL_TEXTURE_WRAP_T                 = 0x2803;

/* TextureTarget */
/*      GL_TEXTURE_2D */
var GL_TEXTURE                        = 0x1702;

var GL_TEXTURE_CUBE_MAP               = 0x8513;
var GL_TEXTURE_BINDING_CUBE_MAP       = 0x8514;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X    = 0x8515;
var GL_TEXTURE_CUBE_MAP_NEGATIVE_X    = 0x8516;
var GL_TEXTURE_CUBE_MAP_POSITIVE_Y    = 0x8517;
var GL_TEXTURE_CUBE_MAP_NEGATIVE_Y    = 0x8518;
var GL_TEXTURE_CUBE_MAP_POSITIVE_Z    = 0x8519;
var GL_TEXTURE_CUBE_MAP_NEGATIVE_Z    = 0x851A;
var GL_MAX_CUBE_MAP_TEXTURE_SIZE      = 0x851C;

/* TextureUnit */
var GL_TEXTURE0                       = 0x84C0;
var GL_TEXTURE1                       = 0x84C1;
var GL_TEXTURE2                       = 0x84C2;
var GL_TEXTURE3                       = 0x84C3;
var GL_TEXTURE4                       = 0x84C4;
var GL_TEXTURE5                       = 0x84C5;
var GL_TEXTURE6                       = 0x84C6;
var GL_TEXTURE7                       = 0x84C7;
var GL_TEXTURE8                       = 0x84C8;
var GL_TEXTURE9                       = 0x84C9;
var GL_TEXTURE10                      = 0x84CA;
var GL_TEXTURE11                      = 0x84CB;
var GL_TEXTURE12                      = 0x84CC;
var GL_TEXTURE13                      = 0x84CD;
var GL_TEXTURE14                      = 0x84CE;
var GL_TEXTURE15                      = 0x84CF;
var GL_TEXTURE16                      = 0x84D0;
var GL_TEXTURE17                      = 0x84D1;
var GL_TEXTURE18                      = 0x84D2;
var GL_TEXTURE19                      = 0x84D3;
var GL_TEXTURE20                      = 0x84D4;
var GL_TEXTURE21                      = 0x84D5;
var GL_TEXTURE22                      = 0x84D6;
var GL_TEXTURE23                      = 0x84D7;
var GL_TEXTURE24                      = 0x84D8;
var GL_TEXTURE25                      = 0x84D9;
var GL_TEXTURE26                      = 0x84DA;
var GL_TEXTURE27                      = 0x84DB;
var GL_TEXTURE28                      = 0x84DC;
var GL_TEXTURE29                      = 0x84DD;
var GL_TEXTURE30                      = 0x84DE;
var GL_TEXTURE31                      = 0x84DF;
var GL_ACTIVE_TEXTURE                 = 0x84E0;

/* TextureWrapMode */
var GL_REPEAT                         = 0x2901;
var GL_CLAMP_TO_EDGE                  = 0x812F;
var GL_MIRRORED_REPEAT                = 0x8370;

/* Uniform Types */
var GL_FLOAT_VEC2                     = 0x8B50;
var GL_FLOAT_VEC3                     = 0x8B51;
var GL_FLOAT_VEC4                     = 0x8B52;
var GL_INT_VEC2                       = 0x8B53;
var GL_INT_VEC3                       = 0x8B54;
var GL_INT_VEC4                       = 0x8B55;
var GL_BOOL                           = 0x8B56;
var GL_BOOL_VEC2                      = 0x8B57;
var GL_BOOL_VEC3                      = 0x8B58;
var GL_BOOL_VEC4                      = 0x8B59;
var GL_FLOAT_MAT2                     = 0x8B5A;
var GL_FLOAT_MAT3                     = 0x8B5B;
var GL_FLOAT_MAT4                     = 0x8B5C;
var GL_SAMPLER_2D                     = 0x8B5E;
var GL_SAMPLER_CUBE                   = 0x8B60;

/* Vertex Arrays */
var GL_VERTEX_ATTRIB_ARRAY_ENABLED        = 0x8622;
var GL_VERTEX_ATTRIB_ARRAY_SIZE           = 0x8623;
var GL_VERTEX_ATTRIB_ARRAY_STRIDE         = 0x8624;
var GL_VERTEX_ATTRIB_ARRAY_TYPE           = 0x8625;
var GL_VERTEX_ATTRIB_ARRAY_NORMALIZED     = 0x886A;
var GL_VERTEX_ATTRIB_ARRAY_POINTER        = 0x8645;
var GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F;

/* Read Format */
var GL_IMPLEMENTATION_COLOR_READ_TYPE   = 0x8B9A;
var GL_IMPLEMENTATION_COLOR_READ_FORMAT = 0x8B9B;

/* Shader Source */
var GL_COMPILE_STATUS                 = 0x8B81;
var GL_INFO_LOG_LENGTH                = 0x8B84;
var GL_SHADER_SOURCE_LENGTH           = 0x8B88;
var GL_SHADER_COMPILER                = 0x8DFA;

/* Shader Binary */
var GL_SHADER_BINARY_FORMATS          = 0x8DF8;
var GL_NUM_SHADER_BINARY_FORMATS      = 0x8DF9;

/* Shader Precision-Specified Types */
var GL_LOW_FLOAT                      = 0x8DF0;
var GL_MEDIUM_FLOAT                   = 0x8DF1;
var GL_HIGH_FLOAT                     = 0x8DF2;
var GL_LOW_INT                        = 0x8DF3;
var GL_MEDIUM_INT                     = 0x8DF4;
var GL_HIGH_INT                       = 0x8DF5;

/* Framebuffer Object. */
var GL_FRAMEBUFFER                    = 0x8D40;
var GL_RENDERBUFFER                   = 0x8D41;

var GL_RGBA4                          = 0x8056;
var GL_RGB5_A1                        = 0x8057;
var GL_RGB565                         = 0x8D62;
var GL_DEPTH_COMPONENT16              = 0x81A5;
var GL_STENCIL_INDEX                  = 0x1901;
var GL_STENCIL_INDEX8                 = 0x8D48;

var GL_RENDERBUFFER_WIDTH             = 0x8D42;
var GL_RENDERBUFFER_HEIGHT            = 0x8D43;
var GL_RENDERBUFFER_INTERNAL_FORMAT   = 0x8D44;
var GL_RENDERBUFFER_RED_SIZE          = 0x8D50;
var GL_RENDERBUFFER_GREEN_SIZE        = 0x8D51;
var GL_RENDERBUFFER_BLUE_SIZE         = 0x8D52;
var GL_RENDERBUFFER_ALPHA_SIZE        = 0x8D53;
var GL_RENDERBUFFER_DEPTH_SIZE        = 0x8D54;
var GL_RENDERBUFFER_STENCIL_SIZE      = 0x8D55;

var GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE           = 0x8CD0;
var GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME           = 0x8CD1;
var GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL         = 0x8CD2;
var GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3;

var GL_COLOR_ATTACHMENT0              = 0x8CE0;
var GL_DEPTH_ATTACHMENT               = 0x8D00;
var GL_STENCIL_ATTACHMENT             = 0x8D20;

var GL_NONE                           = 0;

var GL_FRAMEBUFFER_COMPLETE                      = 0x8CD5;
var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT         = 0x8CD6;
var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS         = 0x8CD9;
var GL_FRAMEBUFFER_UNSUPPORTED                   = 0x8CDD;

var GL_FRAMEBUFFER_BINDING            = 0x8CA6;
var GL_RENDERBUFFER_BINDING           = 0x8CA7;
var GL_MAX_RENDERBUFFER_SIZE          = 0x84E8;

var GL_INVALID_FRAMEBUFFER_OPERATION  = 0x0506;




var GL_MAX_FRAGMENT_UNIFORM_COMPONENTS = 0x8B49;

/* Texture mapping */
var GL_TEXTURE_1D					= 0x0DE0;
var GL_TEXTURE_2D					= 0x0DE1;
var GL_TEXTURE_3D					= 0x806F;

var GL_READ_WRITE					= 0x88BA;

